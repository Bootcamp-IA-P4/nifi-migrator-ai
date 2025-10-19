import os
import io
from supabase import create_client
import re
import unicodedata
import pandas as pd
import csv
from app.core.config import settings

# Cliente con clave anónima
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


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
        file_path = f"{report_id}.md"
        print(f"[Supabase] Attempting to download '{file_path}' from bucket '{bucket}'...")
        response = supabase.storage.from_(bucket).download(file_path)
        return response.decode('utf-8')
    except Exception as e:
        print(f"Error downloading report '{report_id}' from bucket '{bucket}': {e}")
        return None

def truncate_table(table_name: str):
    """
    Deletes all records from a specified Supabase table.
    """
    print(f"[Supabase] Truncating table '{table_name}'...")
    try:
        # Supabase doesn't have a direct 'truncate' method in its client library
        # The way to clear a table is to delete all records.
        result = supabase.table(table_name).delete().gt("id", 0).execute()
        # The .gt("id", 0) is a common pattern to ensure all rows are targeted
        # assuming 'id' is a primary key and starts from 1.
        # If the table might be empty or 'id' can be 0, a simpler .delete().neq("id", None)
        # or just .delete().execute() might be used, but .gt("id", 0) is safer if 'id' is always positive.
        print(f"[Supabase] Table '{table_name}' truncated. Deleted {len(result.data)} records.")
        return {"status": "ok", "deleted_count": len(result.data)}
    except Exception as e:
        print(f"[Supabase ERROR] Failed to truncate table '{table_name}': {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "detail": str(e)}

def upload_csv_to_supabase(csv_file_path: str, table_name: str):
    """
    Reads a CSV file and uploads its content to a Supabase table.
    """
    print(f"[Supabase] Uploading data from {csv_file_path} to table {table_name}...")
    data_to_insert = []
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            header = next(reader)  # Read header row
            # Clean up header to match expected dictionary keys (remove BOM if present)
            header = [h.strip().replace('\ufeff', '') for h in header]

            for i, row in enumerate(reader):
                if len(row) == len(header):
                    row_dict = dict(zip(header, row))
                    data_to_insert.append(row_dict)
                else:
                    print(f"[Supabase WARNING] Skipping malformed row {i+2} in CSV: Expected {len(header)} fields, but got {len(row)}. Row: {row}")

        if data_to_insert:
            result = supabase.table(table_name).insert(data_to_insert).execute()
            print(f"[Supabase] Upload completed for {csv_file_path}. Inserted {len(result.data)} records.")
            return {"status": "ok", "inserted_count": len(result.data)}
        else:
            print(f"[Supabase WARNING] No valid data found to insert from {csv_file_path}.")
            return {"status": "warning", "detail": "No valid data to insert."}

    except Exception as e:
        print(f"[Supabase ERROR] Failed to upload CSV to Supabase: {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "detail": str(e)}