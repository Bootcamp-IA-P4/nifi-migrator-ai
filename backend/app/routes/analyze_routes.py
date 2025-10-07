# Endpoints para anÃ¡lisis de XML
from fastapi import APIRouter, UploadFile, Response, Form, HTTPException, File
from app.services import analyzer, pdf_generator, supabase_registry
from app.models.report import Report
from app.core.config import settings
import os

router = APIRouter()
#    Este endpoint unificado maneja todos los casos de uso, esta explicación luego la borraremos: 
#    1. Ejecuta el análisis costoso UNA SOLA VEZ.
#    2. Guarda siempre el XML original en el historial.
#    3. Opcionalmente guarda el informe .md para auditoría.
#    4. Devuelve el informe en JSON (por defecto) o en PDF.

@router.post("/analyze", summary="Punto de entrada único para análisis, PDF y guardado")
async def unified_analysis(
    file: UploadFile = File(...),
    generate_pdf: bool = Form(False, description="Si es true, devuelve un PDF en lugar de JSON."),
):
    if not file.filename or not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="El archivo debe ser un .xml")

    try:
        clean_filename = file.filename.strip()
        # PASO 1: Leer y guardar el XML original
        contents = await file.read()
        supabase_registry.upload_file_to_bucket(
            file_name=clean_filename,
            file_bytes=contents,
            bucket=settings.SUPABASE_BUCKET1 # 'history'
        )

        # PASO 2: Ejecuta los agentes UNA SOLA VEZ
        report_result = await analyzer.analyze_nifi_xml_and_orchestrate(
            xml_content=contents,
            xml_filename=clean_filename
        )

        if report_result.error:
            raise HTTPException(status_code=500, detail=report_result.error)

        # PASO 3: Guarda el informe .md sempre
        markdown_filename = os.path.splitext(file.filename)[0] + ".md"
        markdown_bytes = report_result.raw_markdown.encode('utf-8')
        supabase_registry.upload_file_to_bucket(
            file_name=markdown_filename,
            file_bytes=markdown_bytes,
            bucket=settings.SUPABASE_BUCKET_REPORTS # 'reports'
        )

        # PASO 4: Decidir qué devolver al usuariO
        if generate_pdf:
            # El usuario quiere el PDF
            pdf_bytes = pdf_generator.create_pdf_from_markdown(report_result.raw_markdown)
            pdf_download_name = os.path.splitext(clean_filename)[0] + "_migration_report.pdf"
            headers = {'Content-Disposition': f'attachment; filename="{pdf_download_name}"'}
            return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
        else:
            # El usuario quiere el JSON (ESTÁ por defecto)
            return report_result

    except Exception as e:
        print(f"[Route ERROR] Error en la ruta /analyze: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")

@router.get("/report/pdf/{report_id}", summary="Descarga un informe guardado como PDF")
async def download_report_as_pdf(report_id: str):
    # Recupera un informe .md previamente guardado desde Supabase,lo convierte a PDF y lo devuelve para su descarga.
    report_id = report_id.strip()
    if not report_id.endswith('.md'):
        report_id += ".md"

    try:
        # 1. Descargar el archivo .md desde el bucket de informes
        markdown_content = supabase_registry.get_report_content_by_id(
            report_id=report_id,
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


# @router.post("/analyze", response_model=Report)
# async def analyze_nifi_template(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()

#         supabase_registry.upload_file_to_bucket(
#             file_name=file.filename,
#             file_bytes=contents,
#             bucket=settings.SUPABASE_BUCKET1 # BUCKET1 es 'history'
#         )
#         print(f"[Route INFO] XML original '{file.filename}' guardado en bucket '{settings.SUPABASE_BUCKET1}'.")

#         report = await analyzer.analyze_nifi_xml_and_orchestrate(
#             xml_content=contents,
#             xml_filename=file.filename
#         )
#         return report
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         print(f"[Route ERROR] Error en la ruta /analyze: {e}")
#         raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")

# @router.post("/pdf", summary="Analiza un XML y devuelve un informe en PDF")
# async def analyze_and_get_pdf(
#     file: UploadFile,
#     store_report: bool = Form(False)
# ):
#     if not file.filename or not file.filename.endswith('.xml'):
#         raise HTTPException(status_code=400, detail="El archivo debe ser un .xml")

#     try:
#         xml_content = await file.read()
        
#         report_result = await analyzer.analyze_nifi_xml_and_orchestrate(
#             xml_content=xml_content,
#             xml_filename=file.filename
#         )

#         if report_result.error:
#             raise HTTPException(status_code=500, detail=report_result.error)

#         pdf_bytes = pdf_generator.create_pdf_from_markdown(report_result.raw_markdown)

#         if store_report:
#             markdown_filename = os.path.splitext(file.filename)[0] + ".md"
#             markdown_bytes = report_result.raw_markdown.encode('utf-8')
        
#             supabase_registry.upload_file_to_bucket(
#                 file_name=markdown_filename,
#                 file_bytes=markdown_bytes,
#                 bucket=settings.SUPABASE_BUCKET_REPORTS
#             )
#             print(f"[Route INFO] Informe '{markdown_filename}' guardado en bucket '{settings.SUPABASE_BUCKET_REPORTS}'.")
#         pdf_download_name = os.path.splitext(file.filename)[0] + "_migration_report.pdf"
#         headers = {
#             'Content-Disposition': f'attachment; filename="{pdf_download_name}"'
#         }
#         return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         print(f"[Route ERROR] Error en la ruta /pdf: {e}")
#         raise HTTPException(status_code=500, detail=f"Error interno del servidor en PDF: {e}")


