import xml.etree.ElementTree as ET
from app.models.report import Report
from app.agents.migration_crew import MigrationCrew 
import sys
import os

# Este es el servicio principal que maneja la lógica de análisis y migración de NiFi.
# recibe una petición web, la traduce para el sistema de IA, le delega todo el trabajo pesado, y luego empaqueta la respuesta de la IA para devolverla al usuario.

def analyze_nifi_xml(xml_content: bytes) -> Report:
    try:
        # Como los agentes trabajan con strings, primero convertimos el XML de bytes a string.
        xml_string = xml_content.decode('utf-8')

        # creamos una instancia del Crew de migración y le pasamos el XML que acabamos de preparar, es decir le pasamos los datos y le decimos que haga su trabajo.
        
        print("🚀 Iniciando el Crew de Migración de NiFi...")
        crew = MigrationCrew(xml_data=xml_string)
        ai_generated_report = crew.run()
        
        print("✅ Crew finalizado. Generando respuesta de la API...")

        # Aquí lo que hacemos es devolver un bloque de texto que es el informe generado por la IA.
        return Report(
            total_processors=-1, # Este valor es un placeholder, la IA debería dar el número real.
            processors=["Análisis realizado por IA"], 
            incompatibilities=[str(ai_generated_report)] 
        )

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return Report(total_processors=0, processors=[], incompatibilities=[f"Error fatal en el servicio: {str(e)}"])


def main():
    # This main block makes the script directly runnable for testing
    # It assumes the script is run from the 'backend' directory.
    xml_file_path = 'nifi-flows/nifi-templates/NiFi_Weather_Flow.xml'

    try:
        print(f"--- Reading XML file from main block: {xml_file_path} ---")
        with open(xml_file_path, 'r', encoding='utf-8') as f:
            xml_content_str = f.read()

        # Convert string to bytes for the analyze_nifi_xml function
        xml_content_bytes = xml_content_str.encode('utf-8')

        # Add the project's root directory to sys.path to allow imports like 'from app.models...'
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        if project_root not in sys.path:
            sys.path.insert(0, project_root)

        report = analyze_nifi_xml(xml_content_bytes)

        print("\n--- Analysis Complete. Final Report from main block: ---")
        final_report_md = report.incompatibilities[0]
        print(final_report_md)

    except FileNotFoundError:
        print(f"Error: XML file not found at {xml_file_path}")
    except Exception as e:
        print(f"An error occurred in main: {e}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    main()
