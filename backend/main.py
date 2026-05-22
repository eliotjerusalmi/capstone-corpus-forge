from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import openai
except ImportError:  # pragma: no cover
    openai = None  # type: ignore

from member3_persistence import storage, tracking
from member3_persistence.db import Database

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "corpus.db"

app = FastAPI(
    title="Corpus Forge Backend",
    version="0.1.0",
    description="Backend API for document ingestion, retrieval-grounded generation, and tracking.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DocumentCreate(BaseModel):
    name: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class GenerateRequest(BaseModel):
    task: str
    document_ids: List[int]
    prompt: Optional[str] = None
    audience: Optional[str] = None
    output_format: Optional[str] = None
    tone: Optional[str] = None
    creativity: Optional[str] = None


class GenerateResponse(BaseModel):
    task: str
    result: str
    tokens_used: int
    document_ids: List[int]


def init_database() -> None:
    storage.init_db(str(DB_PATH))


def list_documents() -> List[Dict[str, Any]]:
    db = Database(str(DB_PATH))
    rows = db.query(
        "SELECT id, name, metadata, created_at FROM documents ORDER BY created_at DESC"
    )
    docs = [
        {
            "id": r["id"],
            "name": r["name"],
            "metadata": json.loads(r["metadata"] or "{}"),
            "created_at": r["created_at"],
        }
        for r in rows
    ]
    db.close()
    return docs


def delete_document(document_id: int) -> bool:
    db = Database(str(DB_PATH))
    cur = db.execute("DELETE FROM documents WHERE id = ?", (document_id,))
    deleted = cur.rowcount > 0
    db.close()
    return deleted


def estimate_tokens(text: str) -> int:
    words = text.split()
    return max(1, len(words) // 3)


def extract_text(upload_file: UploadFile) -> str:
    from io import BytesIO

    content_bytes = upload_file.file.read()
    file_ext = Path(upload_file.filename or "").suffix.lower()

    if file_ext == ".pdf":
        try:
            from PyPDF2 import PdfReader

            reader = PdfReader(BytesIO(content_bytes))
            return "\n\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid PDF or unable to parse PDF content.")

    try:
        return content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return content_bytes.decode("latin-1", errors="ignore")


def build_context(document_ids: List[int]) -> str:
    texts: List[str] = []
    for doc_id in document_ids:
        doc = storage.get_document_by_id(str(DB_PATH), doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail=f"Document {doc_id} not found")
        texts.append(f"Document: {doc['name']}\n{doc['content']}")
    return "\n\n".join(texts)


def openai_generate(prompt: str) -> str:
    if openai is None or not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OpenAI is not configured")
    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


def local_generate(task: str, context: str, prompt: Optional[str], audience: Optional[str], tone: Optional[str]) -> str:
    base = [
        f"Task: {task}",
        f"Audience: {audience or 'general'}",
        f"Tone: {tone or 'neutral'}",
    ]
    if prompt:
        base.append(f"User prompt: {prompt}")
    base.append("Context:\n" + context)

    if task == "flashcards":
        lines = [line.strip() for line in context.splitlines() if line.strip()]
        cards = []
        for i, line in enumerate(lines[:6], start=1):
            cards.append(f"Q{i}: What is this about?\nA{i}: {line[:120]}")
        return "\n\n".join(cards) or "No content available for flashcards."

    if task == "quiz":
        return (
            "1. What is the main purpose of the selected document?\n"
            "2. Name one key term or concept from the content.\n"
            "3. What would a user do with this document?\n"
            "4. What is one strength in the text?\n"
            "5. What is one important detail to remember?\n"
        )

    if task == "code_review":
        return (
            "Code review summary:\n"
            "- Check naming consistency and comment clarity.\n"
            "- Verify separation of concerns between components.\n"
            "- Inspect any large blocks of logic for readability.\n"
            "- Look for missing error handling and edge cases."
        )

    return "AI response is unavailable. Please configure OPENAI_API_KEY or choose a local fallback task."


def generate_text(task: str, document_ids: List[int], prompt: Optional[str], audience: Optional[str], output_format: Optional[str], tone: Optional[str]) -> str:
    context = build_context(document_ids)
    full_prompt = (
        f"You are an AI assistant.\nTask: {task}\nAudience: {audience or 'general'}\nTone: {tone or 'neutral'}\nFormat: {output_format or 'text'}\nPrompt: {prompt or 'Answer using provided documents.'}\n\nContext:\n{context}"
    )
    if openai is not None and os.getenv("OPENAI_API_KEY"):
        try:
            return openai_generate(full_prompt)
        except Exception:
            return local_generate(task, context, prompt, audience, tone)
    return local_generate(task, context, prompt, audience, tone)


@app.on_event("startup")
def startup_event() -> None:
    init_database()


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "database": str(DB_PATH)}


@app.get("/documents")
def get_documents() -> List[Dict[str, Any]]:
    return list_documents()


@app.get("/documents/{document_id}")
def get_document(document_id: int) -> Dict[str, Any]:
    doc = storage.get_document_by_id(str(DB_PATH), document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@app.post("/documents", status_code=201)
def create_document(document: DocumentCreate) -> Dict[str, Any]:
    doc_id = storage.save_document(str(DB_PATH), document.name, document.content, document.metadata)
    return {"id": doc_id, "message": "Document saved"}


@app.post("/documents/upload", status_code=201)
def upload_document(file: UploadFile = File(...), metadata: Optional[str] = Body(None)) -> Dict[str, Any]:
    text = extract_text(file)
    meta = json.loads(metadata) if metadata else {"source": file.filename}
    doc_id = storage.save_document(str(DB_PATH), file.filename or "uploaded", text, meta)
    return {"id": doc_id, "name": file.filename, "message": "Uploaded document stored"}


@app.delete("/documents/{document_id}")
def remove_document(document_id: int) -> Dict[str, Any]:
    deleted = delete_document(document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": document_id, "message": "Document deleted"}


@app.get("/usage")
def usage() -> List[Dict[str, Any]]:
    return storage.query_token_requests(str(DB_PATH))


@app.post("/generate", response_model=GenerateResponse)
def generate(generate_request: GenerateRequest) -> GenerateResponse:
    if not generate_request.document_ids:
        raise HTTPException(status_code=400, detail="Please provide document_ids")
    result = generate_text(
        generate_request.task,
        generate_request.document_ids,
        generate_request.prompt,
        generate_request.audience,
        generate_request.output_format,
        generate_request.tone,
    )
    tokens = estimate_tokens(result)
    tracking.track_request(str(DB_PATH), "anonymous", tokens, {"task": generate_request.task})
    if generate_request.document_ids:
        storage.save_artifact(
            str(DB_PATH), generate_request.document_ids[0],
            f"{generate_request.task}.txt", result.encode("utf-8"),
        )
    return GenerateResponse(
        task=generate_request.task,
        result=result,
        tokens_used=tokens,
        document_ids=generate_request.document_ids,
    )
