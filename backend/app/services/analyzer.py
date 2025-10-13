import os
import uuid
from fastapi import HTTPException

# NUEVA IMPORTACIÓN
from app.services.pdf_generator import generate_pdf_from_markdown 
# -----------------

from app.models.report import Report
from app.services import antipatterns
from app.orchestrator import run_migration_orchestrator

async def analyze_nifi_xml_and_orchestrate(
    xml_content: bytes,
    xml_filename: str
) -> Report:
    print(f"[Service] Iniciando análisis para el archivo {xml_filename}...")

    # Generamos un nombre único para el reporte
    report_name = str(uuid.uuid4())
    # Definimos la ruta donde se guardará el Markdown temporalmente
    # Nota: Asegúrate de que el directorio 'data/reports' exista o créalo.
    report_markdown_path = os.path.join("data", "reports", f"{report_name}.md") 

    try:
        xml_string = xml_content.decode('utf-8', errors="ignore")

        orchestrator_result = run_migration_orchestrator(
            xml_content=xml_string,
            original_xml_filename=xml_filename
        )
        
        json_mapping = orchestrator_result.get("json_mapping")
        markdown_report = orchestrator_result.get("markdown_report")

        if not markdown_report:
            raise ValueError("El orquestador no devolvió un informe en Markdown.")

        # --- Lógica para guardar el Markdown y generar el PDF ---
        # 1. Guardar el contenido del Markdown en un archivo temporal
        os.makedirs(os.path.dirname(report_markdown_path), exist_ok=True)
        with open(report_markdown_path, "w", encoding="utf-8") as f:
            f.write(markdown_report)
            
        # 2. Generar el PDF
        pdf_path = os.path.join("data", "reports", f"{report_name}.pdf")
        generate_pdf_from_markdown(report_markdown_path, pdf_path)
        print(f"[Service] PDF del reporte generado en: {pdf_path}")

        # 3. Opcionalmente: Eliminar el archivo Markdown temporal después de generar el PDF
        os.remove(report_markdown_path)
        # ---------------------------------------------------------
        
        print(f"[Service] Orquestador finalizado. Enriqueciendo resultados...")

        # Construir el objeto structured para el frontend
        structured_for_frontend = {
            "analisis_componentes": json_mapping.get("analisis_componentes", []),
            "puntos_criticos": json_mapping.get("puntos_criticos", []),
            "resumen_ejecutivo": "", # El resumen ejecutivo se generará en el Markdown
            "recomendaciones": [] # Las recomendaciones se generarán en el Markdown
        }

        # Integrar la lógica de 'antipatterns' de la rama 'dev'
        if structured_for_frontend["analisis_componentes"]:
            try:
                # Los antipatrones se detectan sobre los componentes mapeados
                extra_findings = antipatterns.detectar_antipatrones(structured_for_frontend["analisis_componentes"])
                structured_for_frontend["puntos_criticos"].extend(extra_findings)
                print(f"[Service] Detector de antipatrones ejecutado. Encontrados: {len(extra_findings)}")
            except Exception as e:
                print(f"[Service WARNING] No se pudo ejecutar el detector de antipatrones: {e}")

        # Construcción CORRECTA del objeto Report
        final_report = Report(
            structured=structured_for_frontend,
            raw_markdown=markdown_report,
            error=None
        )

        print(f"[Service] Análisis completado. Devolviendo objeto Report.")
        return final_report

    except Exception as e:
        print(f"[Service ERROR] Error durante el análisis y orquestación: {e}")
        # Aseguramos la limpieza del archivo Markdown si falló después de crearlo
        if os.path.exists(report_markdown_path):
            os.remove(report_markdown_path)
            
        # Devolvemos el error en el formato que el frontend espera
        return Report(
            structured=None,
            raw_markdown="",
            error=f"Error interno del servidor: {e}"
        )