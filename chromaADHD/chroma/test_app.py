import os
import sys
import unittest
import json
import io

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

from app import app
from pipeline.document_parser import DocumentParser
from pipeline.chunker import SemanticChunker
from pipeline.vector_store import VectorStoreManager
from pipeline.hybrid_retriever import HybridRetriever
from pipeline.rag_engine import RAGEngine

class TestADHDRAGSystem(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.rag = RAGEngine()

    def test_1_documents_parser(self):
        """المطلوب الاول: فحص الكتب وفهم محتواها"""
        parser = DocumentParser()
        parsed = parser.parse_all()
        self.assertEqual(len(parsed), 3)
        self.assertIn("nice_ng87", parsed)
        self.assertIn("cbt_adhd_harvard", parsed)
        self.assertIn("deep_work_newport", parsed)
        print("✓ 1. Document Parsing & Reference Extraction passed.")

    def test_2_domain_guardrail(self):
        """المطلوب الثاني: تقييد دور المستشار بنطاق ADHD ورفض ما هو خارج التخصص"""
        # 1. In-domain question
        in_res = self.rag.answer_query("كيف أتعامل مع التشتت وتأخير المشتتات أثناء العمل؟")
        self.assertFalse(in_res.get("out_of_domain", False))
        self.assertGreater(len(in_res.get("action_steps", [])), 0)

        # 2. Out-of-domain question
        out_res = self.rag.answer_query("كيف أصلح محرك سيارة تويوتا معطلة؟")
        self.assertTrue(out_res.get("out_of_domain", False))
        self.assertIn("خارج نطاق تخصصي", out_res.get("tldr", ""))
        print("✓ 2. Strict Domain Guardrail (In-Domain vs Out-of-Domain) passed.")

    def test_3_task_decomposition_milestones(self):
        """المطلوب الاول: تفكيك المهمة والملفات لـ Milestones"""
        # Test Text decomposition
        r_text = self.client.post("/api/decompose_task", json={"task_text": "كتابة مشروع التخرج للجامعة وتنسيق المراجع"})
        self.assertEqual(r_text.status_code, 200)
        data = r_text.get_json()
        self.assertEqual(data["status"], "success")
        self.assertGreaterEqual(len(data["data"]["milestones"]), 3)
        
        # Test File upload decomposition
        fake_file = (io.BytesIO(b"Task: Prepare annual financial report and audit invoices."), "project.txt")
        r_file = self.client.post("/api/decompose_task", data={"file": fake_file}, content_type="multipart/form-data")
        self.assertEqual(r_file.status_code, 200)
        data_f = r_file.get_json()
        self.assertEqual(data_f["status"], "success")
        self.assertGreaterEqual(len(data_f["data"]["milestones"]), 3)
        print("✓ 3. Task & File Milestones Decomposition passed.")

    def test_4_flask_endpoints_and_views(self):
        """المطلوب: فحص الصفحات والمؤقت والشات بوت"""
        r_index = self.client.get("/")
        self.assertEqual(r_index.status_code, 200)
        self.assertIn(b"Focus", r_index.data)
        self.assertIn(b"chatbotFloatingBtn", r_index.data)
        self.assertIn(b"viewMilestones", r_index.data)
        print("✓ 4. Flask Views, Floating Chatbot & Mini Timer structure passed.")

if __name__ == "__main__":
    unittest.main()
