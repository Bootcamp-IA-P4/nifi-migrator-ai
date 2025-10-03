import os
from supabase import create_client
import re
import unicodedata
from dotenv import load_dotenv
import os


# Cargar .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("⚠️ SUPABASE_URL o SUPABASE_KEY no están configurados")


SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "nifi-docs")
SUPABASE_BUCKET1 = os.getenv("SUPABASE_BUCKET1", "history")
SUPABASE_BUCKET2 = os.getenv("SUPABASE_BUCKET2", "flow")
# Cliente con clave anónima
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


from app.services.supabase_registry import supabase

def download_pdf_from_bucket(bucket: str, filename: str, local_path: str):
    response = supabase.storage.from_(bucket).download(filename)
    if response is None:
        raise Exception(f"No se pudo descargar {filename} de {bucket}")
    with open(local_path, "wb") as f:
        f.write(response)
    return local_path


def sanitize_filename(filename: str) -> str:
    """Normaliza nombres de archivo eliminando acentos y caracteres especiales"""
    nfkd_form = unicodedata.normalize('NFKD', filename)
    only_ascii = nfkd_form.encode('ASCII', 'ignore').decode('ASCII')
    safe = re.sub(r'[^a-zA-Z0-9._-]', '_', only_ascii)
    return safe


def upload_file_to_bucket(file_name: str, file_bytes: bytes, bucket: str = SUPABASE_BUCKET):
    try:
        safe_name = sanitize_filename(file_name)

        result = supabase.storage.from_(bucket).upload(
            safe_name,
            file_bytes,
            file_options={
                "content-type": "application/octet-stream",
                "upsert": "true"
            }
        )
        return {"status": "ok", "bucket": bucket, "path": safe_name, "bucket_result": result}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "bucket": bucket, "detail": str(e)}


def insert_record(table: str, data: dict):
    """
    Inserta un registro en la base de datos Supabase.
    """
    # Esta función queda, aunque no la uses ahora, por si añades una tabla más tarde.
    result = supabase.table(table).insert(data).execute()
    return result.data

def list_bucket_files(bucket: str = SUPABASE_BUCKET1):
    """
    Obtiene la lista de archivos (flujos) dentro de un bucket de Storage.
    Por defecto usa el bucket 'history'.
    """
    try:
        # Usamos list() para obtener los archivos. 'path' vacío lista la raíz del bucket.
        result = supabase.storage.from_(bucket).list(path="", options={"limit": 100})
        # El resultado es directamente una lista de archivos/objetos.
        return {"status": "ok", "data": result, "bucket": bucket}
    except Exception as e:
        import traceback
        traceback.print_exc()
        # Nota: El error 404 si el bucket no existe
        return {"status": "error", "detail": str(e), "bucket": bucket}