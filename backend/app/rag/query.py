from __future__ import annotations
from typing import List
from .indexer import ensure_index

def rag_search(query: str, k: int = 5):
    db = ensure_index()
    return db.similarity_search(query, k=k)

def get_context_for_agents(query: str, k: int = 5, sep: str = "\n---\n") -> str:
    docs = rag_search(query, k=k)
    parts = []
    for d in docs:
        src = d.metadata.get("source", "unknown")
        parts.append(f"[Fuente: {src}]\n{d.page_content}")
    return sep.join(parts)
