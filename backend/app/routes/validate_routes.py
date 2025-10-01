from fastapi import APIRouter, UploadFile
from app.services import report_parser, validator
from app.core.config import settings
import tempfile

router = APIRouter()

@router.post("/validate", tags=["Validate"])
async def validate_report(file: UploadFile):
    content = await file.read()
    markdown_text = content.decode("utf-8", errors="ignore")

    structured_report = report_parser.parse_markdown_to_json(markdown_text)

    componentes = structured_report.get("analisis_componentes", [])

    resultado = validator.validate_migration_report(componentes, settings.DATASET_PATH)

    return {
        "resumen_ejecutivo": structured_report.get("resumen_ejecutivo", ""),
        "resultado_validacion": resultado
    }
