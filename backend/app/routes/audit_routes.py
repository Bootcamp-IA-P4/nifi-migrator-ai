from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from app.services import supabase_registry
from app.core.config import settings
from pydantic import BaseModel
from app.agents.migration_crew import MigrationCrew

router = APIRouter()

class StoredAuditRequest(BaseModel):
    report_id: str

@router.post("/audit/upload", tags=["Audit"])
async def audit_report_from_upload(report_file: UploadFile = File(...)):
    content = await report_file.read()
    report_content = content.decode("utf-8", errors="ignore")
    crew = MigrationCrew(xml_data=report_content)
    audit_result = crew.run()
    return audit_result

@router.post("/audit/stored", tags=["Audit"])
async def audit_stored_report(request: StoredAuditRequest):
    report_content = supabase_registry.get_report_content_by_id(request.report_id)

    if not report_content:
        raise HTTPException(
            status_code=404,
            detail=f"Report with ID '{request.report_id}' not found in storage."
        )
    
    crew = MigrationCrew(xml_data=report_content)
    audit_result = crew.run()

    return audit_result