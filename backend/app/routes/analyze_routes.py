# Endpoints para análisis de XML
from fastapi import APIRouter, UploadFile, Response
from app.services import analyzer
from app.models.report import Report
import json

router = APIRouter()

@router.post("/analyze")
async def analyze_xml(file: UploadFile):
    content = await file.read()
    result = analyzer.analyze_nifi_xml(content)
    
    # Serializar el resultado a un JSON bonito (indentado)
    json_str = json.dumps(
        result.model_dump(), 
        indent=4, 
        ensure_ascii=False
    )
    
    return Response(content=json_str, media_type='application/json')
