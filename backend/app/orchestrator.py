import os
import json
import litellm
import re # Importar el módulo re para expresiones regulares
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

    # --- Conteo de Tokens de Entrada ---
    try:
        # Usamos un modelo común que litellm puede contar localmente sin API calls
        input_tokens = litellm.token_counter(text=xml_content, model="gpt-3.5-turbo")
        print(f"[Orchestrator] Tokens de entrada del XML (estimado gpt-3.5-turbo): {input_tokens}")
    except Exception as e:
        print(f"[Orchestrator WARNING] No se pudo contar los tokens de entrada: {e}")
    # --- Fin Conteo de Tokens ---

    try:
        # 1. Inicializar la crew con los datos del XML
        migration_crew = MigrationCrew(xml_data=xml_content)

        # 2. Ejecutar la crew. El resultado es un diccionario con ambos outputs.
        crew_results = migration_crew.run()
        markdown_report = crew_results["markdown_report"]
        json_mapping_str_raw = crew_results["json_mapping_str"]
        print("[Orchestrator] Crew finalizada. Procesando resultados...")

        # --- Conteo de Tokens de Salida ---
        try:
            # Usamos un modelo común que litellm puede contar localmente sin API calls
            output_tokens = litellm.token_counter(messages=[{"role": "assistant", "content": markdown_report}], model="gpt-3.5-turbo")
            print(f"[Orchestrator] Tokens de salida del informe (estimado gpt-3.5-turbo): {output_tokens}")
        except Exception as e:
            print(f"[Orchestrator WARNING] No se pudo contar los tokens de salida: {e}")
        # --- Fin Conteo de Tokens ---

        # 3. Extraer JSON del bloque de código Markdown y parsear
        json_mapping = {}
        extracted_json_match = re.search(r"```json\n(.*?)\n```", json_mapping_str_raw, re.DOTALL)
        
        if extracted_json_match:
            json_content = extracted_json_match.group(1).strip()
            try:
                json_mapping = json.loads(json_content)
            except json.JSONDecodeError as e:
                print(f"[Orchestrator ERROR] La salida del agente de mapeo no es un JSON válido (después de extracción): {e}")
                json_mapping = {"error": "Failed to parse mapping agent output (after extraction)", "raw_output": json_content}
        else:
            print("[Orchestrator ERROR] No se encontró bloque de código JSON en la salida del agente de mapeo.")
            json_mapping = {"error": "No JSON code block found", "raw_output": json_mapping_str_raw}


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
