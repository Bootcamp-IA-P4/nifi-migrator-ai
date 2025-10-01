from fastapi import APIRouter, UploadFile, Form, HTTPException
# Importamos la nueva función list_bucket_files
from backend.app.services.supabase_registry import upload_file_to_bucket, insert_record, list_bucket_files

router = APIRouter()

# Nuevo endpoint GET para obtener todos los flujos/archivos
@router.get("/flows")
async def get_all_flows():
    """
    Recupera todos los archivos (flujos) de los buckets 'history' y 'nifi-docs' de Supabase Storage.
    """
    # Lista de buckets que queremos consultar
    TARGET_BUCKETS = ["history", "nifi-docs"]
    
    all_files = []
    error_details = []

    for bucket_name in TARGET_BUCKETS:
        # Llama a la función para listar los archivos del bucket actual
        result = list_bucket_files(bucket_name)

        if result.get("status") == "ok":
            # Si tiene éxito, añadimos los archivos al resultado final
            # También incluimos el nombre del bucket en cada archivo para saber de dónde proviene
            bucket_files = [
                {**file_metadata, "bucket": bucket_name} 
                for file_metadata in result.get("data", [])
            ]
            all_files.extend(bucket_files)
        else:
            # Si hay un error, lo registramos pero continuamos con el siguiente bucket
            error_details.append({
                "bucket": bucket_name,
                "error": result.get("detail", "Error desconocido al listar el bucket.")
            })

    # Si hubo errores irrecuperables en todos los buckets, lanzamos una excepción
    if not all_files and error_details:
        raise HTTPException(
            status_code=500, 
            detail=f"No se pudo listar ningún archivo. Errores: {error_details}"
        )

    # Devolvemos el resultado combinado, incluyendo los errores encontrados
    return {
        "status": "ok",
        "message": f"Archivos listados de los buckets: {', '.join(TARGET_BUCKETS)}",
        "count": len(all_files),
        "files": all_files,
        "errors": error_details # Incluimos una lista de errores, si los hay
    }


@router.post("/upload_template")
async def upload_template(file: UploadFile, bucket: str = Form("history")):
    content = await file.read()

    upload_result = upload_file_to_bucket(file.filename, content, bucket)

    if isinstance(upload_result, dict) and "error" in upload_result:
        # Manejo de error específico para subida
        if upload_result.get("status") == "error":
             raise HTTPException(
                status_code=500,
                detail=f"Error al subir el archivo al bucket '{bucket}': {upload_result['detail']}"
            )
        
    return {
        "status": "ok",
        "bucket": bucket,
        "bucket_result": upload_result
    }
