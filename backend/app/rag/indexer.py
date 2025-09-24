import os
from typing import List, Tuple
from datetime import datetime
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from supabase import create_client
from app.core.config import settings
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from .parsers import parse_by_extension

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
BUCKET = settings.SUPABASE_BUCKET

INDEX_DIR = os.getenv("RAG_INDEX_DIR", "data/rag_index_faiss")
ALLOWED_EXT = {".txt", ".md", ".csv", ".xml", ".pdf"}

def _embedding_model():
    if os.getenv("OPENAI_API_KEY"):
        return OpenAIEmbeddings()
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def _chunk_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=150, separators=["\n\n", "\n", " ", ""]
    )
    return splitter.split_text(text)

def _list_bucket_files(path: str = "") -> List[str]:
    entries = supabase.storage.from_(BUCKET).list(path)
    files = []
    for e in entries:
        if e["name"].lower().endswith(tuple(ALLOWED_EXT)):
            files.append(f"{path}/{e['name']}" if path else e["name"])
    return files

def _download_file(name: str) -> bytes:
    return supabase.storage.from_(BUCKET).download(name)

def _metadata_for(name: str) -> dict:
    return {"source": f"supabase://{BUCKET}/{name}", "ingested_at": datetime.utcnow().isoformat() + "Z"}

def rebuild_index() -> Tuple[FAISS, int]:
    files = _list_bucket_files()
    print("DEBUG Supabase list:", files)
    if not files:
        raise RuntimeError("No se encontraron archivos en el bucket de Supabase")

    docs, metadatas = [], []
    for fname in files:
        raw = _download_file(fname)
        txt = parse_by_extension(fname, raw)
        chunks = _chunk_text(txt)
        meta = _metadata_for(fname)
        docs.extend(chunks)
        metadatas.extend([meta] * len(chunks))

    embeddings = _embedding_model()
    db = FAISS.from_texts(docs, embeddings, metadatas=metadatas)
    os.makedirs(INDEX_DIR, exist_ok=True)
    db.save_local(INDEX_DIR)
    return db, len(docs)

def ensure_index() -> FAISS:
    embeddings = _embedding_model()
    if os.path.isdir(INDEX_DIR) and os.path.exists(os.path.join(INDEX_DIR, "index.faiss")):
        return FAISS.load_local(INDEX_DIR, embeddings, allow_dangerous_deserialization=True)
    db, _ = rebuild_index()
    return db
