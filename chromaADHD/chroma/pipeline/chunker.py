import re
import os
import sys
import json
from typing import List, Dict, Any

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure root dir is in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from config import CHUNKING_CONFIG, PROCESSED_CHUNKS_FILE, DATA_DIR
from pipeline.document_parser import DocumentParser

class SemanticChunker:
    """
    Splits cleaned documents into balanced, contextually rich chunks
    with sentence-boundary awareness, configurable overlap, and enriched metadata.
    """

    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or CHUNKING_CONFIG
        self.target_size = self.config.get("target_chunk_size_words", 380)
        self.min_size = self.config.get("min_chunk_size_words", 150)
        self.max_size = self.config.get("max_chunk_size_words", 550)
        self.overlap_size = self.config.get("overlap_words", 60)

    def split_into_sentences(self, text: str) -> List[str]:
        """
        Splits text cleanly into sentences while respecting common abbreviations.
        """
        # Protect abbreviations like e.g., i.e., Dr., et al., vs., etc.
        protected = text
        protected = re.sub(r'\b(e\.g\.|i\.e\.|et al\.|vs\.|Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|fig\.|tab\.)', lambda m: m.group(0).replace('.', '@@DOT@@'), protected, flags=re.IGNORECASE)
        
        # Split on sentence terminals
        raw_sentences = re.split(r'(?<=[.?!])\s+(?=[A-Z0-9\u0600-\u06FF\(\"\'“‘])', protected)
        
        cleaned_sentences = []
        for s in raw_sentences:
            s_restored = s.replace('@@DOT@@', '.').strip()
            if s_restored:
                cleaned_sentences.append(s_restored)
        return cleaned_sentences

    def chunk_document_pages(self, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Takes a list of page objects from a single document and creates
        balanced, semantic chunks across page boundaries.
        """
        if not pages:
            return []

        doc_id = pages[0]["doc_id"]
        doc_title = pages[0]["doc_title"]
        author = pages[0].get("author", "")
        category = pages[0].get("category", "")

        # Collect all sentence units with their page and section provenance
        sentence_units = []
        for page in pages:
            page_num = page["page_num"]
            section = page["section"]
            paragraphs = page["text"].split("\n\n")
            
            for para in paragraphs:
                para = para.strip()
                if not para:
                    continue
                sentences = self.split_into_sentences(para)
                for sentence in sentences:
                    sentence_units.append({
                        "sentence": sentence,
                        "page_num": page_num,
                        "section": section,
                        "word_count": len(sentence.split())
                    })

        chunks = []
        chunk_idx = 1
        current_sentences = []
        current_word_count = 0
        i = 0

        while i < len(sentence_units):
            unit = sentence_units[i]
            current_sentences.append(unit)
            current_word_count += unit["word_count"]

            # If we have reached the target chunk size or last unit
            if current_word_count >= self.target_size or i == len(sentence_units) - 1:
                # If it's too small and not at the very end, continue adding unless exceeding max_size
                if current_word_count < self.min_size and i < len(sentence_units) - 1:
                    i += 1
                    continue

                # Assemble chunk text
                chunk_text = " ".join([u["sentence"] for u in current_sentences])
                page_nums = [u["page_num"] for u in current_sentences]
                page_start = min(page_nums)
                page_end = max(page_nums)
                
                # Pick most prominent section in this chunk
                sections = [u["section"] for u in current_sentences if u["section"]]
                dominant_section = max(set(sections), key=sections.count) if sections else doc_title

                # Construct structural header context for higher semantic clarity during retrieval
                header_context = f"[Source: {doc_title} | Category: {category} | Pages: {page_start}-{page_end} | Section: {dominant_section}]"
                full_text_with_context = f"{header_context}\n{chunk_text}"

                chunk_obj = {
                    "chunk_id": f"{doc_id}_c{chunk_idx:04d}",
                    "doc_id": doc_id,
                    "doc_title": doc_title,
                    "author": author,
                    "category": category,
                    "page_start": page_start,
                    "page_end": page_end,
                    "section": dominant_section,
                    "header_context": header_context,
                    "text": chunk_text,
                    "full_content": full_text_with_context,
                    "word_count": len(chunk_text.split()),
                    "char_count": len(chunk_text)
                }
                chunks.append(chunk_obj)
                chunk_idx += 1

                # Calculate overlap sentences for the next chunk
                overlap_sentences = []
                overlap_words = 0
                for rev_unit in reversed(current_sentences):
                    if overlap_words + rev_unit["word_count"] <= self.overlap_size:
                        overlap_sentences.insert(0, rev_unit)
                        overlap_words += rev_unit["word_count"]
                    else:
                        break

                current_sentences = overlap_sentences
                current_word_count = overlap_words

            i += 1

        return chunks

    def process_and_save_all(self, save_path: str = None) -> List[Dict[str, Any]]:
        """
        Parses all PDFs, chunks them, and saves the balanced dataset to JSON.
        """
        save_path = save_path or str(PROCESSED_CHUNKS_FILE)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        parser = DocumentParser()
        parsed_docs = parser.parse_all()

        all_chunks = []
        stats = {}

        for doc_id, pages in parsed_docs.items():
            doc_chunks = self.chunk_document_pages(pages)
            all_chunks.extend(doc_chunks)
            
            word_counts = [c["word_count"] for c in doc_chunks]
            avg_words = sum(word_counts) / len(word_counts) if word_counts else 0
            stats[doc_id] = {
                "doc_title": pages[0]["doc_title"] if pages else doc_id,
                "total_chunks": len(doc_chunks),
                "avg_words_per_chunk": round(avg_words, 1),
                "min_words": min(word_counts) if word_counts else 0,
                "max_words": max(word_counts) if word_counts else 0
            }

        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(all_chunks, f, ensure_ascii=False, indent=2)

        print(f"\n📊 === CHUNKING SUMMARY ===")
        print(f"Total Chunks Created: {len(all_chunks)}")
        for doc_id, stat in stats.items():
            print(f"  • {stat['doc_title']}: {stat['total_chunks']} chunks (Avg {stat['avg_words_per_chunk']} words/chunk, Range: [{stat['min_words']}-{stat['max_words']}])")
        print(f"💾 Saved cleanly to: {save_path}\n")

        return all_chunks

if __name__ == "__main__":
    chunker = SemanticChunker()
    chunks = chunker.process_and_save_all()
