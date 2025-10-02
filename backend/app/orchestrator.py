import os
import json
from app.agents.migration_crew import MigrationCrew

OUTPUT_REPORT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'reports')
os.makedirs(OUTPUT_REPORT_DIR, exist_ok=True)

def run_migration_orchestrator(xml_content: str, original_xml_filename: str) -> dict:
    """
    Ejecuta la crew de migración y devuelve un diccionario con los resultados.

    Returns:
        Un diccionario con el mapeo en JSON y el informe final en Markdown.
        {
            "json_mapping": dict,
            "markdown_report": str
        }
    """
    print(f"[Orchestrator] Iniciando para el archivo {original_xml_filename}...")

    try:
        # 1. Inicializar la crew con los datos del XML
        migration_crew = MigrationCrew(xml_data=xml_content)

        # 2. Ejecutar la crew. El resultado es un diccionario con ambos outputs.
        crew_results = migration_crew.run()
        markdown_report = crew_results["markdown_report"]
        json_mapping_str = crew_results["json_mapping_str"]
        print("[Orchestrator] Crew finalizada. Procesando resultados...")

        # 3. Parsear el string JSON a un diccionario de Python
        try:
            json_mapping = json.loads(json_mapping_str)
        except json.JSONDecodeError:
            print("[Orchestrator ERROR] La salida del agente de mapeo no es un JSON válido.")
            json_mapping = {"error": "Failed to parse mapping agent output", "raw_output": json_mapping_str}


        # 4. Guardar el informe Markdown en un archivo
        report_filename = f"report-{os.path.splitext(original_xml_filename)[0]}.md"
        report_path = os.path.join(OUTPUT_REPORT_DIR, report_filename)
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(markdown_report)
        print(f"[Orchestrator] Informe guardado en: {report_path}")

        # 5. Devolver ambos resultados
        return {
            "json_mapping": json_mapping,
            "markdown_report": markdown_report
        }

    except Exception as e:
        print(f"[Orchestrator ERROR] Ha ocurrido un error inesperado: {e}")
        raise