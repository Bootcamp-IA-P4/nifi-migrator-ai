from fastapi import APIRouter, UploadFile, File, HTTPException, Body
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

@router.get("/audit/report/{report_id}/pdf", tags=["Audit"])
async def download_audit_report_pdf(report_id: str):
    """
    Generates and downloads an audit report as a PDF.
    """
    report_content_markdown = supabase_registry.get_report_content_by_id(report_id, settings.SUPABASE_BUCKET_REPORTS)

    if not report_content_markdown:
        raise HTTPException(
            status_code=404,
            detail=f"Informe '{report_id}' no encontrado."
        )
    
    try:
        pdf_bytes = pdf_generator.create_pdf_from_markdown(report_content_markdown)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=\"audit_report_{report_id}.pdf\""}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando PDF para el informe '{report_id}': {str(e)}"
        )