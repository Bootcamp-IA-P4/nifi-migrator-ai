from fastapi import APIRouter, UploadFile, Form
from app.services.supabase_client import upload_file_to_bucket, insert_record

router = APIRouter()

@router.post("/upload_template")
async def upload_template(file: UploadFile, bucket: str = Form("history")):
    content = await file.read()

    upload_result = upload_file_to_bucket(file.filename, content, bucket)

    if isinstance(upload_result, dict) and "error" in upload_result:
        return {
            "status": "error",
            "bucket": bucket,
            "detail": upload_result["error"]
        }

    return {
        "status": "ok",
        "bucket": bucket,
        "bucket_result": upload_result
    }
