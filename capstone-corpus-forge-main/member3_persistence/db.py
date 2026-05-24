import sqlite3
import json
from typing import Any, List


class Database:
    def __init__(self, path: str):
        self.path = path
        self._conn = None
        self.connect()
        self._init_tables()

    def connect(self):
        self._conn = sqlite3.connect(self.path, detect_types=sqlite3.PARSE_DECLTYPES)
        self._conn.row_factory = sqlite3.Row

    def _init_tables(self):
        cur = self._conn.cursor()
        cur.executescript(
            """
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE,
            content TEXT,
            metadata TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS embeddings (
            id INTEGER PRIMARY KEY,
            doc_id INTEGER,
            vector TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS artifacts (
            id INTEGER PRIMARY KEY,
            doc_id INTEGER,
            name TEXT,
            data BLOB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS token_requests (
            id INTEGER PRIMARY KEY,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user TEXT,
            tokens_used INTEGER,
            meta TEXT
        );
        """
        )
        self._conn.commit()

    def execute(self, sql: str, params: tuple = ()):  # type: ignore
        cur = self._conn.cursor()
        cur.execute(sql, params)
        self._conn.commit()
        return cur

    def query(self, sql: str, params: tuple = ()):  # type: ignore
        cur = self._conn.cursor()
        cur.execute(sql, params)
        return cur.fetchall()

    def close(self):
        if self._conn:
            self._conn.close()
            self._conn = None
