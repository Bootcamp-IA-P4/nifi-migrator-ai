from app.rag.pdf_rag import build_pdf_rag_from_supabase

def main():
    # Construir el RAG con los PDFs del bucket "flow"
    qa = build_pdf_rag_from_supabase(bucket="flow")

    while True:
        query = input("\n❓ Pregunta sobre los PDFs (o 'exit' para salir): ")
        if query.lower() in ["exit", "quit"]:
            break
        answer = qa.run(query)
        print(f"\n💡 Respuesta: {answer}\n")


if __name__ == "__main__":
    main()
