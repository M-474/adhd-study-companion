# ADHD Study Companion

> An AI-powered web application that helps university students with ADHD turn study materials into personalized, actionable study plans using AI, RAG, and evidence-based guidance.

## 📌 Overview

ADHD Study Companion is a web-based academic support platform designed to help university students with ADHD manage their academic workload more effectively.

The platform combines an interactive assessment, AI-powered personalization, PDF and lecture analysis, task breakdown, progress tracking, and a RAG-powered chatbot to provide personalized academic support.

## 🎯 Problem

University students with ADHD may experience difficulties with:

* Starting and completing tasks
* Breaking large assignments into manageable steps
* Organizing study materials
* Maintaining focus
* Planning and prioritizing academic work
* Managing overwhelming amounts of information

Traditional study tools often provide the same experience to every student without considering individual needs and difficulties.

## 💡 Solution

ADHD Study Companion uses AI to create a more personalized academic experience.

The platform:

1. Assesses the user's needs through an interactive assessment.
2. Uses the assessment results to personalize the user experience.
3. Analyzes uploaded PDFs and lecture materials.
4. Breaks academic content into actionable tasks.
5. Generates personalized study plans.
6. Provides evidence-based academic guidance through a RAG-powered chatbot.
7. Helps users track their progress and stay organized.

## ✨ Key Features

* 🧩 Interactive assessment
* 🤖 AI-powered personalization
* 📄 PDF and lecture analysis
* 📝 Automatic task breakdown
* 📚 Personalized study plans
* 🧠 RAG-powered knowledge base
* 💬 AI chatbot
* 📊 Progress tracking
* 🔔 Reminders and notifications
* 📖 Evidence-based academic guidance

## 🏗️ System Architecture

The application consists of several main components:

```text
User
  │
  ▼
Web Application
  │
  ├── Interactive Assessment
  │
  ├── Study Plan Generation
  │
  ├── PDF / Lecture Processing
  │
  ├── Personalization Engine
  │
  └── AI Chatbot
          │
          ▼
       RAG Pipeline
          │
          ├── Document Processing
          ├── Chunking
          ├── Embeddings
          ├── Vector Database
          └── Retrieval
                  │
                  ▼
                LLM
```

## 🧠 AI & RAG

The platform uses Retrieval-Augmented Generation (RAG) to provide responses based on a curated knowledge base.

The RAG pipeline includes:

* Document ingestion
* PDF processing
* Text chunking
* Embedding generation
* Vector storage
* Semantic retrieval
* Context-aware response generation

The system retrieves relevant information from the knowledge base before generating responses, helping keep the chatbot grounded in reliable sources.

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript / TypeScript
* HTML
* CSS

### Backend

* Python
* Flask / FastAPI
* REST APIs

### AI

* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* LangChain
* Sentence Transformers

### Database & Storage

* PostgreSQL
* ChromaDB

### Development

* Git
* GitHub
* VS Code

## 📂 Project Structure

```text
adhd-study-companion/
│
├── frontend/
│
├── backend/
│
├── rag/
│   ├── ingest.py
│   ├── ...
│
├── tests/
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

> The project structure may evolve as development continues.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Python 3.11+
* Node.js
* npm
* Git
* PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/adhd-study-companion.git

cd adhd-study-companion
```

### Backend Setup

```bash
python -m venv .venv
```

Activate the virtual environment:

**Windows:**

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file based on `.env.example`.

Do not commit API keys, passwords, or other secrets to GitHub.

### Run the Application

Start the backend:

```bash
# Add the actual backend command here
```

Start the frontend:

```bash
# Add the actual frontend command here
```

Then open the web application in your browser.

## 📸 Screenshots

Add screenshots or GIFs of the web application here.

Example:

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── assessment.png
    ├── study-plan.png
    └── chatbot.png
```

## 🔐 Privacy & Security

The application is designed with user privacy and security in mind.

* API keys are stored in environment variables.
* Sensitive credentials are not committed to the repository.
* Authentication and authorization are handled through the backend.
* User data should only be accessed according to the application's authorization rules.

## ⚠️ Disclaimer

ADHD Study Companion is an educational and academic support platform.

It does **not** provide medical diagnosis, medical treatment, or professional clinical advice.

The platform's recommendations are intended to provide educational and study-support strategies based on available evidence and should not replace consultation with qualified healthcare professionals.

## 🗺️ Roadmap

* [x] Interactive assessment
* [x] AI personalization
* [x] PDF processing
* [x] RAG knowledge base
* [x] AI chatbot
* [x] Personalized study plans
* [x] Task breakdown
* [x] Progress tracking
* [ ] Advanced personalization
* [ ] University integrations
* [ ] More academic resources

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
