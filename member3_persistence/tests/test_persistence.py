from pathlib import Path
import sys


def _add_pkg_root():
    p = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(p))


_add_pkg_root()

from member3_persistence import storage, tracking


def test_document_embedding_artifact_and_tracking(tmp_path):
    db_file = str(tmp_path / "test.db")
    storage.init_db(db_file)

    doc_id = storage.save_document(db_file, "doc1", "hello world", {"source": "unit-test"})
    assert doc_id is not None

    doc = storage.get_document_by_id(db_file, doc_id)
    assert doc and doc["name"] == "doc1"

    emb_id = storage.save_embedding(db_file, doc_id, [0.1, 0.2, 0.3])
    assert emb_id is not None

    embs = storage.get_embeddings_by_doc(db_file, doc_id)
    assert len(embs) == 1

    art_id = storage.save_artifact(db_file, doc_id, "output.txt", b"bytes")
    assert art_id is not None

    data = storage.get_artifact(db_file, doc_id, "output.txt")
    assert data == b"bytes"

    tr_id = tracking.track_request(db_file, "tester", 123, {"route": "/ask"})
    assert tr_id is not None

    tokens = storage.query_token_requests(db_file)
    assert tokens and tokens[0]["tokens_used"] == 123
