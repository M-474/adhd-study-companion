import os
import sys
import json
from flask import Flask, render_template, request, jsonify

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure root dir is in sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from config import DOCUMENTS_CONFIG, SERVER_HOST, SERVER_PORT, DEBUG_MODE, PROCESSED_CHUNKS_FILE
from pipeline.rag_engine import RAGEngine
from pipeline.vector_store import VectorStoreManager

app = Flask(__name__)

# Initialize RAG Engine singleton
print("⏳ Initializing ADHD RAG Pipeline & ChromaDB...")
rag_engine = RAGEngine()
print("✓ RAG Pipeline initialized and ready.")

@app.route("/")
def index():
    """Main ADHD Focus & RAG Assistance Page."""
    return render_template("index.html", documents=DOCUMENTS_CONFIG)

@app.route("/api/query", methods=["POST"])
def api_query():
    """
    RAG Query Endpoint:
    Receives ADHD question, retrieves relevant chunks, and returns structured advice.
    """
    try:
        data = request.get_json() or {}
        query = data.get("query", "").strip()
        top_k = int(data.get("top_k", 4))
        filter_doc = data.get("filter_doc", None)

        if not query:
            return jsonify({"error": "الرجاء إدخال سؤال أو استشارة للبحث"}), 400

        result = rag_engine.answer_query(query=query, top_k=top_k, filter_doc=filter_doc)
        return jsonify({
            "status": "success",
            "data": result
        })
    except Exception as e:
        print(f"Error handling query: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/breakdown_task", methods=["POST"])
def api_breakdown_task():
    """
    CBT Task Breakdown Endpoint (Harvard Module 1).
    Decomposes overwhelming tasks into bite-sized micro-steps.
    """
    try:
        data = request.get_json() or {}
        task = data.get("task", "").strip()

        if not task:
            return jsonify({"error": "الرجاء كتابة المهمة المراد تفكيكها"}), 400

        result = rag_engine.breakdown_task(task)
        return jsonify({
            "status": "success",
            "data": result
        })
    except Exception as e:
        print(f"Error breaking down task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/decompose_task", methods=["POST"])
def api_decompose_task():
    """
    Task & File Milestone Decomposition Endpoint:
    Accepts text or uploaded file (PDF/TXT), reads it, breaks into Milestones with RAG advice.
    """
    try:
        task_text = ""
        
        # 1. Check for uploaded file
        if "file" in request.files:
            file = request.files["file"]
            if file and file.filename:
                file_bytes = file.read()
                fname_lower = file.filename.lower()
                
                if fname_lower.endswith(".pdf"):
                    import pymupdf
                    pdf_doc = pymupdf.open(stream=file_bytes, filetype="pdf")
                    extracted = []
                    for page in pdf_doc:
                        extracted.append(page.get_text())
                    task_text = "\n".join(extracted)
                else:
                    task_text = file_bytes.decode("utf-8", errors="ignore")

        # 2. Check for text body if no file text
        if not task_text:
            if request.is_json:
                data = request.get_json() or {}
                task_text = data.get("task_text", "").strip()
            else:
                task_text = request.form.get("task_text", "").strip()

        if not task_text:
            return jsonify({"status": "error", "message": "الرجاء كتابة المهمة أو رفع ملف لتحليله."}), 400

        # Limit text length to prevent overload
        task_text_trimmed = task_text[:12000].strip()
        result = rag_engine.decompose_task_to_milestones(task_text_trimmed)

        return jsonify({
            "status": "success",
            "data": result
        })
    except Exception as e:
        print(f"Error decomposing task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/sources", methods=["GET"])
def api_sources():
    """Returns metadata for all 3 referenced books."""
    return jsonify({
        "status": "success",
        "sources": DOCUMENTS_CONFIG
    })

@app.route("/api/chunks", methods=["GET"])
def api_chunks():
    """
    Chunk Explorer Endpoint:
    Allows user to inspect raw chunks, search by keyword, or filter by document.
    """
    try:
        doc_filter = request.args.get("doc_id", None)
        search_kw = request.args.get("search", "").lower()
        page = int(request.args.get("page", 1))
        page_size = int(request.args.get("page_size", 10))

        if not os.path.exists(str(PROCESSED_CHUNKS_FILE)):
            return jsonify({"status": "error", "message": "Chunks file not found"}), 404

        with open(str(PROCESSED_CHUNKS_FILE), "r", encoding="utf-8") as f:
            chunks = json.load(f)

        filtered = chunks
        if doc_filter:
            filtered = [c for c in filtered if c.get("doc_id") == doc_filter]

        if search_kw:
            filtered = [c for c in filtered if search_kw in c.get("text", "").lower() or search_kw in c.get("section", "").lower()]

        total_matches = len(filtered)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated = filtered[start_idx:end_idx]

        return jsonify({
            "status": "success",
            "total": total_matches,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_matches + page_size - 1) // page_size if total_matches > 0 else 1,
            "chunks": paginated
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Returns database & RAG statistics."""
    try:
        total_chunks = len(rag_engine.retriever.chunks)
        vector_count = rag_engine.retriever.vector_store.collection.count()
        return jsonify({
            "status": "online",
            "documents_count": len(DOCUMENTS_CONFIG),
            "total_chunks": total_chunks,
            "vector_store_count": vector_count,
            "embedding_type": "Dense Semantic Local + BM25 Hybrid RRF",
            "ready": True
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    print(f"🚀 Starting ADHD Focus RAG Server at http://{SERVER_HOST}:{SERVER_PORT}")
    app.run(host=SERVER_HOST, port=SERVER_PORT, debug=DEBUG_MODE)
