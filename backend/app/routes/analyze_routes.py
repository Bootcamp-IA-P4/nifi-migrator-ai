# Endpoints para análisis de XML
from fastapi import APIRouter, UploadFile
from app.services import analyzer
from app.models.report import Report

router = APIRouter()

@router.post("/analyze", response_model=Report)
async def analyze_xml(file: UploadFile):
    content = await file.read()
    result = analyzer.analyze_nifi_xml(content)
    return result
