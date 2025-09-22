from app.models.report import Report
from app.agents.migration_crew import MigrationCrew 
from . import report_parser

# Este es el servicio principal que maneja la lógica de análisis y migración de NiFi.
# recibe una petición web, la traduce para el sistema de IA, le delega todo el trabajo pesado, y luego empaqueta la respuesta de la IA para devolverla al usuario.

def analyze_nifi_xml(xml_content: bytes) -> Report:
    try:
        # Como los agentes trabajan con strings, primero convertimos el XML de bytes a string.
        xml_string = xml_content.decode('utf-8', errors="ignore")

        # creamos una instancia del Crew de migración y le pasamos el XML que acabamos de preparar, es decir le pasamos los datos y le decimos que haga su trabajo.
        
        print("🚀 Iniciando el Crew de Migración de NiFi...")
        crew = MigrationCrew(xml_data=xml_string)
        ai_generated_report = crew.run()
        
        
        print("✅ Crew finalizado. Generando respuesta de la API...")

        structured_report_dict = None
        try:
            structured_report_dict = report_parser.parse_markdown_to_json(str(ai_generated_report))
        except Exception as parse_err:
            print(f"No se pudo parsear el informe a JSON estructurado: {parse_err}")
        
        print("✅ Parsing completado. Generando respuesta de la API...")
        
        return Report(structured=structured_report_dict, raw_markdown=str(ai_generated_report))

    except Exception as e:
        print(f"Error durante la ejecución: {e}")
        return Report(error=f"Error fatal en el servicio: {str(e)}")
