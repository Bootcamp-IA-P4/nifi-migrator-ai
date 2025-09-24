import pytest
import os
from dotenv import load_dotenv

load_dotenv()  

from app.rag import indexer

# verificamos variables primero
def test_env_variables():
    assert os.getenv("SUPABASE_URL"), "Falta SUPABASE_URL en .env"
    assert os.getenv("SUPABASE_KEY"), "Falta SUPABASE_KEY en .env"
    assert os.getenv("SUPABASE_BUCKET"), "Falta SUPABASE_BUCKET en .env"

# verificamos que el bucket contenga archivos
def test_list_bucket_files():
    files = indexer._list_bucket_files()
    assert isinstance(files, list)
    assert all(isinstance(f, str) for f in files)
    assert any(f.endswith(".csv") for f in files), "No se encontró ningún CSV en el bucket"

# verificamos que se pueda reconstruir un índice FAISS
def test_rebuild_index(tmp_path):
    indexer.INDEX_DIR = str(tmp_path / "rag_index_faiss")

    db, n_chunks = indexer.rebuild_index()
    assert db is not None
    assert n_chunks > 0
    assert os.path.exists(os.path.join(indexer.INDEX_DIR, "index.faiss"))
