import json
from typing import Any, List, Optional
from .db import Database


def init_db(path: str) -> None:
    Database(path).close()


def save_document(db_path: str, name: str, content: str, metadata: Optional[dict] = None) -> int:
    db = Database(db_path)
    meta = json.dumps(metadata or {})
    cur = db.execute(
        "INSERT OR REPLACE INTO documents (name, content, metadata) VALUES (?, ?, ?)",
        (name, content, meta),
    )
    rowid = cur.lastrowid
    db.close()
    return rowid


def get_document_by_id(db_path: str, doc_id: int) -> Optional[dict]:
    db = Database(db_path)
    rows = db.query("SELECT * FROM documents WHERE id = ?", (doc_id,))
    db.close()
    if not rows:
        return None
    row = rows[0]
    return {"id": row["id"], "name": row["name"], "content": row["content"], "metadata": json.loads(row["metadata"] or "{}")}


def get_document_by_name(db_path: str, name: str) -> Optional[dict]:
    db = Database(db_path)
    rows = db.query("SELECT * FROM documents WHERE name = ?", (name,))
    db.close()
    if not rows:
        return None
    row = rows[0]
    return {"id": row["id"], "name": row["name"], "content": row["content"], "metadata": json.loads(row["metadata"] or "{}")}


def save_embedding(db_path: str, doc_id: int, vector: List[float]) -> int:
    db = Database(db_path)
    vec = json.dumps(vector)
    cur = db.execute("INSERT INTO embeddings (doc_id, vector) VALUES (?, ?)", (doc_id, vec))
    rowid = cur.lastrowid
    db.close()
    return rowid


def get_embeddings_by_doc(db_path: str, doc_id: int) -> List[List[float]]:
    db = Database(db_path)
    rows = db.query("SELECT * FROM embeddings WHERE doc_id = ?", (doc_id,))
    db.close()
    return [json.loads(r["vector"]) for r in rows]


def save_artifact(db_path: str, doc_id: int, name: str, data: bytes) -> int:
    db = Database(db_path)
    cur = db.execute("INSERT INTO artifacts (doc_id, name, data) VALUES (?, ?, ?)", (doc_id, name, data))
    rowid = cur.lastrowid
    db.close()
    return rowid


def get_artifact(db_path: str, doc_id: int, name: str) -> Optional[bytes]:
    db = Database(db_path)
    rows = db.query("SELECT data FROM artifacts WHERE doc_id = ? AND name = ?", (doc_id, name))
    db.close()
    if not rows:
        return None
    return bytes(rows[0]["data"])


def query_token_requests(db_path: str) -> List[dict]:
    db = Database(db_path)
    rows = db.query("SELECT * FROM token_requests ORDER BY id DESC")
    db.close()
    return [{"id": r["id"], "timestamp": r["timestamp"], "user": r["user"], "tokens_used": r["tokens_used"], "meta": json.loads(r["meta"] or "{}")} for r in rows]
