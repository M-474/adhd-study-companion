import re
import os
import sys

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

import pymupdf
from typing import List, Dict, Any
from config import DOCUMENTS_CONFIG

class DocumentParser:
    """
    Extracts and cleans text from ADHD reference PDFs while preserving
    page numbers, chapter/section titles, and document metadata.
    """

    def __init__(self, doc_configs: List[Dict[str, Any]] = None):
        self.doc_configs = doc_configs or DOCUMENTS_CONFIG

    def clean_text(self, text: str, doc_id: str) -> str:
        """
        Cleans OCR artifacts, removes repetitive headers/footers,
        fixes hyphenation across lines, and normalizes whitespaces.
        """
        if not text:
            return ""

        # Normalize carriage returns and non-breaking spaces
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        text = text.replace('\xa0', ' ').replace('\u200b', '')

        # Remove specific recurring document headers/footers
        if doc_id == "nice_ng87":
            text = re.sub(r'Attention deficit hyperactivity disorder:\s*diagnosis and management\s*\(NG87\)', '', text, flags=re.IGNORECASE)
            text = re.sub(r'©\s*NICE\s*\d{4}\.\s*All rights reserved\..*?(?=\n|$)', '', text, flags=re.IGNORECASE)
            text = re.sub(r'https?://www\.nice\.org\.uk/.*?(?=\n|$)', '', text, flags=re.IGNORECASE)
            text = re.sub(r'Page\s+\d+\s+of\s+\d+', '', text, flags=re.IGNORECASE)
        
        elif doc_id == "cbt_adhd_harvard":
            text = re.sub(r'NIH-PA Author Manuscript', '', text)
            text = re.sub(r'Sprich et al\.\s+Page \d+', '', text)
            text = re.sub(r'Cogn Behav Pract\.\s*Author manuscript.*?(?=\n|$)', '', text, flags=re.IGNORECASE)
            text = re.sub(r'Author Manuscript', '', text)
            
        elif doc_id == "deep_work_newport":
            text = re.sub(r'DEEP WORK\s*\n', '\n', text, flags=re.IGNORECASE)
            text = re.sub(r'CAL NEWPORT\s*\n', '\n', text, flags=re.IGNORECASE)
            text = re.sub(r'In accordance with the U\.S\. Copyright Act.*?(?=\n\n)', '', text, flags=re.DOTALL)

        # Fix hyphenated words broken across lines: e.g. "concen-\ntration" -> "concentration"
        text = re.sub(r'(\b[a-zA-Z]{2,})-\n([a-zA-Z]{2,}\b)', r'\1\2', text)

        # Fix multiple newlines inside sentences while keeping paragraph breaks
        # Replace 3 or more newlines with double newline
        text = re.sub(r'\n{3,}', '\n\n', text)

        # Fix isolated page number lines
        text = re.sub(r'\n\s*\d+\s*\n', '\n', text)

        # Normalize spaces
        text = re.sub(r'[ \t]+', ' ', text)

        return text.strip()

    def parse_document(self, doc_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parses a single PDF document into cleaned page objects with metadata.
        """
        doc_id = doc_config["id"]
        file_path = doc_config["file_path"]
        title = doc_config["title"]
        category = doc_config["category"]

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found: {file_path}")

        print(f"📖 Parsing '{title}' ({file_path})...")
        pdf_doc = pymupdf.open(file_path)
        pages_data = []

        current_section = title

        for page_idx in range(len(pdf_doc)):
            page = pdf_doc[page_idx]
            raw_text = page.get_text("text")
            page_num = page_idx + 1

            # Detect potential section headers from the first few lines
            lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
            if lines:
                first_line = lines[0]
                if len(first_line) < 80 and not first_line.isdigit():
                    if any(keyword in first_line.lower() for keyword in ['rule', 'chapter', 'part', 'recommendation', 'module', 'section', 'overview', 'introduction', 'step']):
                        current_section = first_line

            cleaned_text = self.clean_text(raw_text, doc_id)

            # Skip essentially empty pages
            if len(cleaned_text.split()) < 15:
                continue

            pages_data.append({
                "doc_id": doc_id,
                "doc_title": title,
                "author": doc_config.get("author", ""),
                "category": category,
                "page_num": page_num,
                "section": current_section,
                "text": cleaned_text,
                "word_count": len(cleaned_text.split())
            })

        print(f"✓ Parsed {len(pages_data)} valid pages from '{title}'")
        return pages_data

    def parse_all(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Parses all configured documents.
        """
        all_parsed = {}
        for doc_cfg in self.doc_configs:
            all_parsed[doc_cfg["id"]] = self.parse_document(doc_cfg)
        return all_parsed

if __name__ == "__main__":
    parser = DocumentParser()
    parsed = parser.parse_all()
    total_pages = sum(len(p) for p in parsed.values())
    total_words = sum(sum(page["word_count"] for page in pages) for pages in parsed.values())
    print(f"\n🎉 Successfully parsed {len(parsed)} documents, {total_pages} total pages, ~{total_words:,} total words.")
