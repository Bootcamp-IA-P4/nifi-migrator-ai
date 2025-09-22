# Endpoints para análisis de XML
from fastapi import APIRouter, UploadFile
from services import analyzer
from models.report import Report

router = APIRouter()

@router.post("/analyze", response_model=Report)
async def analyze_xml(file: UploadFile):
    content = await file.read()
    result = analyzer.analyze_nifi_xml(content)
    return result

from fastapi import APIRouter
from services.nifi_parser import parse_template, parse_directory, export_to_csv
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "nifi-flows", "nifi-templates")
CSV_OUT = os.path.join(BASE_DIR, "data", "comparative.csv")

@router.get("/analyze/{filename}")
def analyze_template(filename: str):
    """Analiza un template en particular y devuelve JSON"""
    path = os.path.join(TEMPLATES_DIR, filename)
    if not os.path.exists(path):
        return {"error": f"Template {filename} no encontrado"}
    return parse_template(path)

@router.get("/analyze_all")
def analyze_all():
    """Analiza todos los templates y genera el CSV comparativo"""
    parsed = parse_directory(TEMPLATES_DIR)
    export_to_csv(parsed, CSV_OUT)
    return {
        "status": "ok",
        "templates": [tpl["template"] for tpl in parsed],
        "csv": CSV_OUT,
    }
