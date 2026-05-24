import json
from .db import Database


def track_request(db_path: str, user: str, tokens_used: int, meta: dict | None = None) -> int:
    db = Database(db_path)
    meta_s = json.dumps(meta or {})
    cur = db.execute("INSERT INTO token_requests (user, tokens_used, meta) VALUES (?, ?, ?)", (user, tokens_used, meta_s))
    rowid = cur.lastrowid
    db.close()
    return rowid
