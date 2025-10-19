from __future__ import annotations
from typing import List
from .indexer import ensure_index
from app.services.supabase_registry import supabase # Import the Supabase client
from app.core.config import settings # Import settings to get the table name
from app.services.migration_plan_provider import migration_plan_provider # Import the migration plan provider
import re # Import re for regular expressions

def rag_search(query: str, k: int = 5):
    db = ensure_index()
    return db.similarity_search(query, k=k)

def get_context_for_agents(query: str, k: int = 5, sep: str = "\n---\n") -> str:
    parts = []

    print(f"🔍 Priorizando búsqueda en tabla de Supabase para equivalencias de migración...")

    # 1. Prioritize direct lookup in Supabase for migration plans
    potential_component_names = re.findall(r'[a-zA-Z0-9\._-]+', query) # Matches words, dots, hyphens

    found_direct_plan = False
    for comp_name in potential_component_names:
        print(f"✨ Buscando plan de migración para componente: {comp_name}")
        plan = migration_plan_provider.find_component(comp_name)
        if plan:
            print(f"✅ ¡Plan de migración encontrado en Supabase para {plan.get('nifi1_component')}!")
            parts.append(f"[Fuente: Supabase Migration Plan - {plan.get('nifi1_component')}]\n"
                         f"Estado: {plan.get('status')}\n"
                         f"Equivalente NiFi 2: {plan.get('nifi2_equivalent')}\n"
                         f"Cambios de Propiedad: {plan.get('property_changes')}\n"
                         f"Configuración Recomendada: {plan.get('recommended_config')}\n"
                         f"Ejemplos: {plan.get('examples')}\n"
                         f"Documentación Fuente: {plan.get('source_doc')}")
            found_direct_plan = True
            break # Prioritize the first direct match found

    # 2. Fallback to general RAG search if no direct plan is found or for broader context
    if not found_direct_plan:
        print(f"📚 No se encontró plan directo en Supabase. Realizando búsqueda RAG en documentos...")
        docs = rag_search(query, k=k)
        for d in docs:
            src = d.metadata.get("source", "unknown")
            parts.append(f"[Fuente: {src}]\n{d.page_content}")
    else:
        print(f"ℹ️ Contexto enriquecido con plan de migración de Supabase. No se realizará búsqueda RAG adicional.")
    
    return sep.join(parts)
