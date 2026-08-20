import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
CHROMA_DB_DIR = DATA_DIR / "chroma_db"
PROCESSED_CHUNKS_FILE = DATA_DIR / "processed_chunks.json"

# Source PDF Documents
DOCUMENTS_CONFIG = [
    {
        "id": "nice_ng87",
        "file_path": str(BASE_DIR / "87.pdf"),
        "title": "NICE Guideline NG87: ADHD Diagnosis and Management",
        "author": "National Institute for Health and Care Excellence (NICE)",
        "year": "2018/2019",
        "category": "Clinical Guidelines & Diagnosis",
        "description": "Evidence-based clinical guidelines on ADHD diagnosis, environmental modifications, medication, diet, and multi-agency support.",
        "icon": "fa-stethoscope",
        "badge_color": "badge-nice"
    },
    {
        "id": "cbt_adhd_harvard",
        "file_path": str(BASE_DIR / "nihms464625.pdf"),
        "title": "CBT for ADHD in Adults (Harvard / MGH Protocol)",
        "author": "Susan E. Sprich, Laura E. Knouse, Steven A. Safren, et al.",
        "year": "2012",
        "category": "CBT & Behavioral Therapy",
        "description": "Empirical Cognitive Behavioral Therapy protocol: notebook & calendar planning, distraction delay, task breakdown, and cognitive restructuring.",
        "icon": "fa-brain",
        "badge_color": "badge-cbt"
    },
    {
        "id": "deep_work_newport",
        "file_path": str(BASE_DIR / "Deep Work.pdf"),
        "title": "Deep Work: Rules for Focused Success",
        "author": "Cal Newport",
        "year": "2016",
        "category": "Focus & Attention Management",
        "description": "Rules for high-depth focus, digital minimalism, structured time-blocking rituals, overcoming boredom, and draining shallow tasks.",
        "icon": "fa-bolt",
        "badge_color": "badge-deepwork"
    }
]

# Chunking Configuration
CHUNKING_CONFIG = {
    "target_chunk_size_words": 380,
    "min_chunk_size_words": 150,
    "max_chunk_size_words": 550,
    "overlap_words": 60,
    "max_paragraph_length": 600
}

# Hybrid Retrieval Settings
RETRIEVAL_CONFIG = {
    "top_k": 5,
    "dense_weight": 0.6,
    "bm25_weight": 0.4,
    "rrf_k": 60,
    "collection_name": "adhd_knowledge_base"
}

# Server Settings
SERVER_HOST = "127.0.0.1"
SERVER_PORT = int(os.environ.get("PORT", 5000))
DEBUG_MODE = False

# API Keys (Optional - works with local generator if not set)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
