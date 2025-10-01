import os
from .agents.migration_crew import MigrationCrew

# Define el directorio de salida para los informes
OUTPUT_REPORT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'reports')
os.makedirs(OUTPUT_REPORT_DIR, exist_ok=True)

def run_migration_orchestrator(xml_content: str, original_xml_filename: str) -> str:
    """
    Orquesta la ejecución de la Crew de migración y guarda el informe resultante.

    Args:
        xml_content: El contenido del archivo XML de NiFi 1.x como una cadena.
        original_xml_filename: El nombre del archivo XML original para nombrar el informe.

    Returns:
        El informe de migración en formato Markdown como una cadena.
    """
    print("[Orchestrator] Iniciando el proceso de migración...")

    # 1. Instanciar la Crew de Migración (ya no necesita el CSV)
    migration_crew_instance = MigrationCrew(xml_data=xml_content)

    # 2. Ejecutar la Crew
    print("[Orchestrator] Ejecutando la Crew de Migración...")
    crew_output = migration_crew_instance.run()
    print("[Orchestrator] Crew de Migración finalizada.")

    # 3. Extraer el informe en bruto del objeto de salida y verificarlo
    result_markdown_report = crew_output.raw if crew_output else None
    
    if not result_markdown_report or not isinstance(result_markdown_report, str):
        print("[Orchestrator ERROR] La ejecución de la crew no produjo un informe en Markdown válido.")
        raise ValueError("El resultado de la Crew está vacío o no es texto. No se puede generar el informe.")

    # 4. Guardar el informe Markdown, usando el nombre del archivo original
    report_filename = os.path.basename(original_xml_filename).replace('.xml', '_migration_report.md')
    report_path = os.path.join(OUTPUT_REPORT_DIR, report_filename)
    try:
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(result_markdown_report)
        print(f"[Orchestrator] Informe Markdown guardado en: {report_path}")
    except Exception as e:
        print(f"[Orchestrator ERROR] Error al guardar el informe Markdown: {e}")
        # A pesar del error al guardar, devolvemos el informe para que la API no falle
        return result_markdown_report

    # TODO: La conversión a PDF se puede añadir aquí si es necesario.

    print("[Orchestrator] Proceso de orquestación completado.")
    return result_markdown_report

if __name__ == "__main__":
    # Esta sección es para pruebas locales y necesita ser actualizada si se usa.
    print("Para pruebas locales, ejecute la aplicación FastAPI y use el endpoint /analyze.")