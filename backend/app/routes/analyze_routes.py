from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.responses import PlainTextResponse # Para devolver Markdown

from app.services import analyzer # Importar el servicio actualizado

router = APIRouter()

@router.post("/analyze", response_class=PlainTextResponse) # Devolverá texto plano (Markdown)
async def analyze_xml_endpoint(
    nifi_xml_file: UploadFile = File(...)
):
    # Leer el contenido del archivo XML directamente en el endpoint
    xml_content = await nifi_xml_file.read()

    # Delegar la lógica de análisis y orquestación al servicio
    # Ahora se ejecuta de forma síncrona para depuración
    try:
        markdown_report = await analyzer.analyze_nifi_xml_and_orchestrate(
            xml_content=xml_content,
            xml_filename=nifi_xml_file.filename
        )
        return markdown_report
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor durante el análisis: {e}")