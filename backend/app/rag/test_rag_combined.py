from app.rag.rag_combined import get_combined_context

if __name__ == "__main__":
    query = "Migración de NiFi 1.x a 2.x y uso de anti-patrones"
    contexto = get_combined_context(query)
    print("\n=== CONTEXTO COMBINADO ===\n")
    print(contexto[:2000])  # Muestra los primeros 2000 caracteres
