from fastapi import APIRouter, HTTPException
from app.rag.pdf_rag import build_pdf_rag_from_supabase # Importa la función RAG

# Crea el router de FastAPI
router = APIRouter()

@router.post("/report")
async def generate_nifi_report():
    """
    Endpoint para construir el RAG a partir de los documentos de Supabase
    y generar un informe técnico consolidado sobre NiFi.
    """
    try:
        # 1. Construir el RAG (carga PDFs, crea embeddings, configura LLM)
        # Esto puede tardar varios segundos (o minutos si los embeddings se descargan por primera vez)
        qa_chain = build_pdf_rag_from_supabase(bucket="flow")

        # 2. Definir la consulta para el informe
        report_query = (
            "Eres un analista técnico de alto nivel. Genera un informe CONCISO y COMPLETO "
            "basado EXCLUSIVAMENTE en los documentos cargados. El informe debe "
            "incluir en secciones claramente etiquetadas: "
            "1. Definición y Propósito de NiFi. "
            "2. Resumen de la Migración o Actualización (detalles de versiones y procesos clave). "
            "3. Componentes y Conceptos Importantes (Processors, Flows, etc.)."
            "Asegúrate de que la respuesta final esté completamente en español."
        )

        # 3. Ejecutar la cadena de RAG para obtener el informe
        result = qa_chain.invoke({"query": report_query})

        # 4. Devolver el informe como parte de la respuesta JSON de la API
        return {
            "status": "success",
            "model": "llama-3.1-8b-instant (Groq)",
            "report_title": "Informe Técnico de Documentación NiFi",
            "report_content": result.get('result', 'No se pudo generar el contenido del informe.'),
        }

    except Exception as e:
        # Si ocurre algún error (ej. problema de Supabase, Groq, o falta de archivos)
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar el informe: {str(e)}"
        )