import os
import sys
import re
import math
import json
from collections import Counter
from typing import List, Dict, Any, Tuple, Optional

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

from config import PROCESSED_CHUNKS_FILE, RETRIEVAL_CONFIG
from pipeline.vector_store import VectorStoreManager

class BM25OkapiRetriever:
    """
    In-memory Okapi BM25 indexer for fast, high-precision keyword retrieval.
    """

    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.doc_len: List[int] = []
        self.avg_doc_len: float = 0.0
        self.doc_freqs: List[Dict[str, int]] = []
        self.idf: Dict[str, float] = {}
        self.corpus_size: int = 0
        self.chunks: List[Dict[str, Any]] = []

    def _tokenize(self, text: str) -> List[str]:
        # Tokenize English and Arabic words
        return re.findall(r'[\w\u0600-\u06FF]+', text.lower())

    def index_chunks(self, chunks: List[Dict[str, Any]]):
        self.chunks = chunks
        self.corpus_size = len(chunks)
        self.doc_len = []
        self.doc_freqs = []
        df_counts = Counter()

        for chunk in chunks:
            text = chunk.get("full_content", chunk.get("text", ""))
            tokens = self._tokenize(text)
            self.doc_len.append(len(tokens))
            
            tf = Counter(tokens)
            self.doc_freqs.append(tf)
            for word in tf.keys():
                df_counts[word] += 1

        self.avg_doc_len = sum(self.doc_len) / self.corpus_size if self.corpus_size > 0 else 1.0

        # Calculate IDF
        self.idf = {}
        for word, freq in df_counts.items():
            # Standard BM25 IDF formulation
            self.idf[word] = math.log((self.corpus_size - freq + 0.5) / (freq + 0.5) + 1.0)

    def search(self, query: str, top_k: int = 10) -> List[Dict[str, Any]]:
        tokens = self._tokenize(query)
        if not tokens or not self.corpus_size:
            return []

        scores = []
        for i in range(self.corpus_size):
            score = 0.0
            doc_len = self.doc_len[i]
            tf_dict = self.doc_freqs[i]

            for tok in tokens:
                if tok in tf_dict:
                    freq = tf_dict[tok]
                    idf = self.idf.get(tok, 0.0)
                    numerator = freq * (self.k1 + 1)
                    denominator = freq + self.k1 * (1 - self.b + self.b * (doc_len / self.avg_doc_len))
                    score += idf * (numerator / denominator)

            if score > 0:
                scores.append((i, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        top_results = scores[:top_k]

        max_score = top_results[0][1] if top_results else 1.0
        results = []
        for doc_idx, raw_score in top_results:
            chunk = self.chunks[doc_idx]
            norm_score = raw_score / max_score if max_score > 0 else 0.0
            results.append({
                "chunk_id": chunk["chunk_id"],
                "content": chunk.get("full_content", chunk.get("text", "")),
                "metadata": {
                    "chunk_id": chunk["chunk_id"],
                    "doc_id": chunk["doc_id"],
                    "doc_title": chunk["doc_title"],
                    "category": chunk.get("category", ""),
                    "page_start": chunk.get("page_start", 1),
                    "page_end": chunk.get("page_end", 1),
                    "section": chunk.get("section", ""),
                    "author": chunk.get("author", ""),
                    "word_count": chunk.get("word_count", 0)
                },
                "score": round(float(norm_score), 4),
                "raw_score": round(float(raw_score), 4),
                "retrieval_type": "bm25_lexical"
            })
        return results

class ADHDQueryExpander:
    """
    Translates and expands ADHD domain queries across Arabic and English
    with psychiatric, behavioral, and clinical terminology.
    """
    TERM_MAPPINGS = {
        "تشتت": "distraction distractibility attention span focus interrupt",
        "تركيز": "focus attention deep work concentration sustained attention",
        "تسويف": "procrastination avoid delay task initiation postponement",
        "مماطلة": "procrastination delay putting off tasks motivation",
        "تنظيم": "organization notebook calendar planner scheduling time management",
        "شلل تنفيذي": "executive dysfunction task initiation overwhelm starting task",
        "صعوبة البدء": "task initiation executive function breaking down tasks",
        "تفكيك المهام": "chunking task breakdown bite-sized subtasks manageable steps",
        "أفكار سلبية": "automatic thoughts cognitive restructuring CBT all-or-nothing",
        "قلق": "anxiety stress overwhelm emotional regulation",
        "أدوية": "medication stimulant methylphenidate lisdexamfetamine atomoxetine guanfacine",
        "علاج دوائي": "pharmacological treatment titration dosage monitoring side effects",
        "علاج سلوكي": "CBT cognitive behavioral therapy psychosocial psychosocial intervention",
        "بيئة": "environment workplace school adjustments accommodations sensory overload",
        "نوم": "sleep routine bedtime shutdown ritual insomnia",
        "بومودورو": "pomodoro timer time blocking micro bursts interval",
        "نيس": "NICE guideline recommendations diagnosis assessment",
        "هارفارد": "Safren Sprich CBT for ADHD in adults Massachusetts General Hospital",
        "عمل عميق": "deep work Cal Newport rules rituals monastic rhythmic"
    }

    @classmethod
    def expand_query(cls, query: str) -> str:
        expanded_terms = [query]
        query_lower = query.lower()

        for key, synonyms in cls.TERM_MAPPINGS.items():
            if key in query_lower:
                expanded_terms.append(synonyms)

        return " ".join(expanded_terms)

class HybridRetriever:
    """
    Combines Dense Vector Search (ChromaDB) and Sparse BM25 Search
    using Reciprocal Rank Fusion (RRF).
    """

    def __init__(self, chunks_file: str = None):
        self.chunks_file = chunks_file or str(PROCESSED_CHUNKS_FILE)
        
        # Load raw chunks
        if not os.path.exists(self.chunks_file):
            from pipeline.chunker import SemanticChunker
            chunker = SemanticChunker()
            self.chunks = chunker.process_and_save_all()
        else:
            with open(self.chunks_file, "r", encoding="utf-8") as f:
                self.chunks = json.load(f)

        # Initialize components
        self.vector_store = VectorStoreManager()
        self.vector_store.populate_from_chunks()

        self.bm25 = BM25OkapiRetriever()
        self.bm25.index_chunks(self.chunks)

        self.top_k = RETRIEVAL_CONFIG.get("top_k", 5)
        self.rrf_k = RETRIEVAL_CONFIG.get("rrf_k", 60)
        self.dense_weight = RETRIEVAL_CONFIG.get("dense_weight", 0.6)
        self.bm25_weight = RETRIEVAL_CONFIG.get("bm25_weight", 0.4)

    def retrieve(self, query: str, top_k: Optional[int] = None, filter_doc: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Executes hybrid retrieval:
        1. Expands query with ADHD domain terminology.
        2. Queries ChromaDB (Dense) and BM25 (Sparse).
        3. Fuses rankings with Reciprocal Rank Fusion (RRF).
        """
        k = top_k or self.top_k
        expanded_query = ADHDQueryExpander.expand_query(query)

        # 1. Dense Vector Search (fetch 2x candidates)
        dense_results = self.vector_store.search_vector(expanded_query, top_k=k * 2)

        # 2. BM25 Keyword Search (fetch 2x candidates)
        bm25_results = self.bm25.search(expanded_query, top_k=k * 2)

        # 3. Reciprocal Rank Fusion (RRF)
        fused_scores = {}
        chunks_map = {}

        # Process Dense Ranks
        for rank, item in enumerate(dense_results):
            cid = item["chunk_id"]
            chunks_map[cid] = item
            rrf_score = self.dense_weight * (1.0 / (self.rrf_k + rank + 1))
            fused_scores[cid] = fused_scores.get(cid, 0.0) + rrf_score

        # Process BM25 Ranks
        for rank, item in enumerate(bm25_results):
            cid = item["chunk_id"]
            if cid not in chunks_map:
                chunks_map[cid] = item
            rrf_score = self.bm25_weight * (1.0 / (self.rrf_k + rank + 1))
            fused_scores[cid] = fused_scores.get(cid, 0.0) + rrf_score

        # Filter by document if requested
        if filter_doc:
            filtered_cids = [cid for cid in fused_scores.keys() if chunks_map[cid]["metadata"]["doc_id"] == filter_doc]
            fused_scores = {cid: fused_scores[cid] for cid in filtered_cids}

        # Sort by fused score
        sorted_cids = sorted(fused_scores.keys(), key=lambda cid: fused_scores[cid], reverse=True)
        top_cids = sorted_cids[:k]

        max_fused = fused_scores[top_cids[0]] if top_cids else 1.0
        final_results = []

        for cid in top_cids:
            item = chunks_map[cid]
            norm_confidence = round(float(fused_scores[cid] / max_fused if max_fused > 0 else 1.0), 4)
            final_results.append({
                "chunk_id": cid,
                "content": item["content"],
                "metadata": item["metadata"],
                "score": norm_confidence,
                "rrf_score": round(float(fused_scores[cid]), 6),
                "retrieval_type": "hybrid_rrf"
            })

        return final_results

if __name__ == "__main__":
    retriever = HybridRetriever()
    test_queries = [
        "كيف أتعامل مع التشتت وتأخير المشتتات أثناء العمل؟",
        "NICE guidelines recommendation for ADHD medication titration",
        "طريقة تنظيم المهام والتسويف في بروتوكول هارفارد CBT"
    ]
    for q in test_queries:
        print(f"\n==================================================")
        print(f"❓ Query: {q}")
        res = retriever.retrieve(q, top_k=2)
        for i, r in enumerate(res, 1):
            print(f" [{i}] Score: {r['score']} | {r['metadata']['doc_title']} (p.{r['metadata']['page_start']}-{r['metadata']['page_end']})")
            print(f"     Section: {r['metadata']['section']}")
            print(f"     Snippet: {r['content'][:150]}...")
