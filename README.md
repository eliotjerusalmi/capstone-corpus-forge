# Corpus Forge — Capstone Project

**Generative AI for Software Engineering — EPITA 2026**

Corpus Forge is a full-stack AI-powered application that lets you upload documents and use them as a knowledge base for AI-generated flashcards, quizzes, and chat answers.

---

## Architecture

```
capstone-corpus-forge/
├── backend/               # FastAPI backend
│   ├── main.py            # API routes (/documents, /generate, /usage)
│   └── requirements.txt
├── frontend/              # React + Vite + Tailwind frontend
│   └── src/pages/         # Upload, Chat, Flashcards, Quiz, Reports...
├── member3_persistence/   # SQLite persistence layer (Member 3)
│   ├── db.py
│   ├── storage.py
│   ├── tracking.py
│   └── tests/
└── REPORT.md              # Project report
```

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt

# Optional: set your OpenAI key for real AI generation
export OPENAI_API_KEY=your_key_here

uvicorn main:app --reload
# → API available at http://localhost:8000
# → Docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → App available at http://localhost:5173
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET | `/documents` | List all documents |
| POST | `/documents/upload` | Upload a file |
| DELETE | `/documents/{id}` | Delete a document |
| POST | `/generate` | Generate flashcards, quiz, or chat answer |
| GET | `/usage` | Token usage log |

---

## Features

- **Upload** — `.txt`, `.md`, `.pdf`, `.py`, `.js` files stored in SQLite
- **Document Manager** — view and delete corpus documents
- **Chat** — ask questions grounded in selected documents
- **Flashcards** — AI-generated Q&A cards from your corpus
- **Quiz** — multiple-choice questions with scoring
- **Prompt Steering** — control tone, creativity, domain
- **Cost Dashboard** — real-time token usage tracking
