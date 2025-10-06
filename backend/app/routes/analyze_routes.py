# Endpoints para anÃ¡lisis de XML
from fastapi import APIRouter, UploadFile, Response, Form, HTTPException
from app.services import analyzer, pdf_generator, supabase_registry
from app.models.report import Report
from app.core.config import settings
import os

router = APIRouter()

@router.post("/analyze", response_model=Report)
async def analyze_xml(file: UploadFile):
    content = await file.read()
    result = analyzer.analyze_nifi_xml(content)
    return result

@router.post("/pdf", summary="Analiza un XML y devuelve un informe en PDF")
async def analyze_and_get_pdf(
    file: UploadFile,
    store_report: bool = Form(False)
):
    if not file.filename or not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="El archivo debe ser un .xml")

    xml_content = await file.read()
    
    report_result = analyzer.analyze_nifi_xml(xml_content)

    if report_result.error:
        raise HTTPException(status_code=500, detail=report_result.error)

    pdf_bytes = pdf_generator.create_pdf_from_markdown(report_result.raw_markdown)

    if store_report:
        markdown_filename = os.path.splitext(file.filename)[0] + ".md"
        
        markdown_bytes = report_result.raw_markdown.encode('utf-8')
        
        supabase_registry.upload_file_to_bucket(
            file_name=markdown_filename,
            file_bytes=markdown_bytes,
            bucket=settings.SUPABASE_BUCKET1 
        )
    pdf_bytes = pdf_generator.create_pdf_from_markdown(report_result.raw_markdown)
    pdf_download_name = os.path.splitext(file.filename)[0] + "_migration_report.pdf"
    headers = {
        'Content-Disposition': f'attachment; filename="{pdf_download_name}"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)