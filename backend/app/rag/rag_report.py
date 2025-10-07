from app.rag.pdf_rag import build_pdf_rag_from_supabase
import sys

def generate_report():
    """
    Construye el RAG, genera un informe detallado basado en los PDFs cargados
    y luego finaliza.
    """
    print("Iniciando la construcción del RAG...")
    try:
        # Construir el RAG con los PDFs del bucket "flow"
        qa = build_pdf_rag_from_supabase(bucket="flow")

        # 1. Definir la consulta para el informe
        # Usamos un prompt detallado para obtener un buen resumen
        report_query = (
            "Eres un analista técnico. Genera un informe conciso y completo "
            "basado EXCLUSIVAMENTE en los documentos cargados. El informe debe "
            "incluir: 1) ¿Qué es NiFi (definición y propósito)? 2) Información clave "
            "sobre la migración o actualización de NiFi (versiones o procesos mencionados) "
            "y 3) Menciona cualquier concepto clave o componente importante (como Processors, Flows)."
        )

        print("\n📝 Generando Informe...")
        
        # 2. Ejecutar la consulta del informe (usando .invoke() en lugar del obsoleto .run())
        # qa.invoke espera un diccionario como entrada
        result = qa.invoke({"query": report_query})

        # 3. Imprimir el resultado
        # El resultado de qa.invoke es un diccionario, la respuesta está en la clave 'result'
        answer = result.get('result', 'No se pudo obtener la respuesta.')
        
        print("\n" + "="*50)
        print("         ✅ INFORME GENERADO POR RAG")
        print("="*50)
        print(answer)
        print("="*50 + "\n")

    except Exception as e:
        print(f"\n❌ Ha ocurrido un error crítico durante la generación del informe: {e}", file=sys.stderr)
        
        # Si el error es el de Groq, mostramos un mensaje de ayuda
        if "llama3-8b-8192" in str(e):
             print("\n¡AVISO IMPORTANTE! El error de Groq indica que el modelo 'llama3-8b-8192' está obsoleto. Asegúrate de que el archivo 'app/rag/pdf_rag.py' esté guardado y contenga el modelo 'llama-3.1-8b-instant'.")


if __name__ == "__main__":
    generate_report()