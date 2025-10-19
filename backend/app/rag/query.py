from __future__ import annotations
from typing import List
from .indexer import ensure_index

def rag_search(query: str, k: int = 5):
    """Performs a similarity search on the FAISS index."""
    db = ensure_index()
    return db.similarity_search(query, k=k)

def get_context_for_agents(query: str, k: int = 5, sep: str = "\n---\n") -> str:
    """Fetches context from the document RAG based on a query string."""
    parts = []
    print(f"📚 Realizando búsqueda RAG en documentos con la consulta: '{query}'")
    
    docs = rag_search(query, k=k)
    for d in docs:
        src = d.metadata.get("source", "unknown")
        parts.append(f"[Fuente RAG Doc: {src}]\n{d.page_content}")
        
    if not parts:
        return "No se encontró contexto en la documentación RAG para la consulta."

    return sep.join(parts)
