from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import PlainTextResponse
from app.services import analyzer
from app.models.report import Report

router = APIRouter()

@router.post("/analyze", response_model=Report)
async def analyze_nifi_template(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        report = await analyzer.analyze_nifi_xml_and_orchestrate(
            xml_content=contents,
            xml_filename=file.filename
        )
        return report
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[Route ERROR] Error en la ruta /analyze: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")