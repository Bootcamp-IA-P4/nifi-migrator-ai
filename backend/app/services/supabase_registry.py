import os
import io
from supabase import create_client
import re
import unicodedata
from app.core.config import settings

# Cliente con clave de servicio para operaciones de escritura
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


def sanitize_filename(filename: str) -> str:
    """Normaliza nombres de archivo eliminando acentos y caracteres especiales"""
    nfkd_form = unicodedata.normalize('NFKD', filename)
    only_ascii = nfkd_form.encode('ASCII', 'ignore').decode('ASCII')
    safe = re.sub(r'[^a-zA-Z0-9._-]', '_', only_ascii)
    return safe


def upload_file_to_bucket(file_name: str, file_bytes: bytes, bucket: str):
    try:
        destination_path = file_name 
        content_type = "application/octet-stream"
        if destination_path.endswith(".xml"):
            content_type = "application/xml"
        elif destination_path.endswith(".md"):
            content_type = "text/markdown"

        print(f"[Supabase] Subiendo '{destination_path}' desde memoria al bucket '{bucket}'...")
        
        
        supabase.storage.from_(bucket).upload(
            path=destination_path,
            file=file_bytes,
            file_options={"content-type": content_type, "upsert": "true"}
        )
        print(f"[Supabase] Subida completada para '{destination_path}'.")
        return {"status": "ok", "path": destination_path}
    except Exception as e:
        print(f"[Supabase ERROR] {e}")
        raise e

def insert_record(table: str, data: dict):
    """
    Inserta un registro en la base de datos Supabase.
    """
    result = supabase.table(table).insert(data).execute()
    return result.data

def list_bucket_files(bucket: str = settings.SUPABASE_BUCKET1):
    """
    Obtiene la lista de archivos (flujos) dentro de un bucket de Storage.
    Por defecto usa el bucket 'history'.
    """
    try:
        result = supabase.storage.from_(bucket).list(path="", options={"limit": 100})
        return {"status": "ok", "data": result, "bucket": bucket}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "detail": str(e), "bucket": bucket}

# esta función nos sirve para obtener el contenido de un informe
def get_report_content_by_id(report_id: str, bucket: str = settings.SUPABASE_BUCKET_REPORTS) -> str | None:
    try:
        response = supabase.storage.from_(bucket).download(report_id)
        return response.decode('utf-8')
    except Exception as e:
        print(f"Error downloading report '{report_id}' from bucket '{bucket}': {e}")
        return None