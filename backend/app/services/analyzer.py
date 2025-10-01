import os
import uuid
from fastapi import HTTPException

from app.services import report_parser
from app.orchestrator import run_migration_orchestrator

# Directorio de salida para los informes, gestionado ahora por el orquestador
OUTPUT_REPORT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'reports')
os.makedirs(OUTPUT_REPORT_DIR, exist_ok=True)

async def analyze_nifi_xml_and_orchestrate(
    xml_content: bytes,
    xml_filename: str
) -> str:
    """
    Función principal de servicio que recibe los datos del endpoint,
    invoca al orquestador y maneja la generación de informes.

    Args:
        xml_content: Contenido del archivo XML en bytes.
        xml_filename: Nombre del archivo XML original.

    Returns:
        El informe de migración en formato Markdown.
    """
    file_id = str(uuid.uuid4())
    print(f"[Service] Iniciando orquestación para el flujo {file_id} con el archivo {xml_filename}...")

    try:
        # 1. Convertir el contenido XML de bytes a string
        xml_string = xml_content.decode('utf-8', errors="ignore")

        # 2. Ejecutar el orquestador (lógica principal ahora aquí)
        # Ya no necesita la ruta del CSV, pero sí el nombre del archivo original.
        markdown_report = run_migration_orchestrator(
            xml_content=xml_string,
            original_xml_filename=xml_filename
        )
        print(f"[Service] Orquestador finalizado para {xml_filename}.")

        # 3. La lógica de guardar archivos ya está dentro del orquestador.

        # 4. Devolver el informe en Markdown a la ruta para la respuesta de la API
        return markdown_report

    except HTTPException as e:
        # Re-lanzar excepciones HTTP para que FastAPI las maneje
        raise e
    except Exception as e:
        # Capturar cualquier otra excepción y devolver un error 500
        print(f"[Service ERROR] Error durante el análisis y orquestación: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")