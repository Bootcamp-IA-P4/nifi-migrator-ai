import os
from fastapi import APIRouter, Response, UploadFile, File, HTTPException, Body
from fastapi.responses import StreamingResponse # Import StreamingResponse
from app.services import auditor, supabase_registry, pdf_generator # Import pdf_generator
from app.core.config import settings
from pydantic import BaseModel
import io # Import io for BytesIO

router = APIRouter()

class StoredAuditRequest(BaseModel):
    report_id: str

@router.post("/audit/upload", tags=["Audit"])
async def audit_report_from_upload(report_file: UploadFile = File(...)):
    content = await report_file.read()
    report_content = content.decode("utf-8", errors="ignore")
    audit_result = auditor.run_audit(report_content, settings.DATASET_PATH)
    return audit_result

@router.post("/audit/stored", tags=["Audit"])
async def audit_stored_report(request: StoredAuditRequest):
    report_content = supabase_registry.get_report_content_by_id(request.report_id)

    if not report_content:
        raise HTTPException(
            status_code=404,
            detail=f"Report with ID '{request.report_id}' not found in storage."
        )
    audit_result = auditor.run_audit(report_content, settings.DATASET_PATH)

    return audit_result

@router.get("/report/pdf/{report_id}", summary="Descarga un informe guardado como PDF")
async def download_report_as_pdf(report_id: str):
    # Recupera un informe .md previamente guardado desde Supabase,lo convierte a PDF y lo devuelve para su descarga.
    report_id = report_id.strip()
    # Ensure the report_id always has the .md extension for Supabase lookup
    final_report_id_for_supabase = report_id if report_id.endswith('.md') else f"{report_id}.md"

    try:
        # 1. Descargar el archivo .md desde el bucket de informes
        markdown_content = supabase_registry.get_report_content_by_id(
            report_id=final_report_id_for_supabase,
            bucket=settings.SUPABASE_BUCKET_REPORTS # 'reports'
        )
        if not markdown_content:
            raise HTTPException(status_code=404, detail=f"Informe '{report_id}' no encontrado.")

        # 2. Convertir el contenido a PDF
        pdf_bytes = pdf_generator.create_pdf_from_markdown(markdown_content)

        # 3. Preparar y devolver la respuesta para descarga
        pdf_download_name = os.path.splitext(report_id)[0] + "_migration_report.pdf"
        headers = {'Content-Disposition': f'attachment; filename="{pdf_download_name}"'}
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

    except HTTPException as e:
        raise e 
    except Exception as e:
        print(f"[Route ERROR] Error en la ruta /report/pdf/{report_id}: {e}")
        raise HTTPException(status_code=500, detail=f"No se pudo generar el PDF: {e}")