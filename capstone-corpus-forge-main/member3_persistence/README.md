# Member 3 — Persistence

This module provides a simple SQLite-based persistence layer for documents, embeddings, generated artifacts, and token/request tracking used in the capstone project.

Quick start:

1. Initialize a DB: `from member3_persistence import storage; storage.init_db('db.sqlite')`
2. Save a document: `storage.save_document('db.sqlite', 'name', 'content', {'meta': 'v'})`
3. Run tests: `pytest capstone-corpus-forge/member3_persistence/tests -q`
