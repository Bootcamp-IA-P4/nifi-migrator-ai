from app.models.report import Report
from app.agents.migration_crew import MigrationCrew 
from . import report_parser
from . import antipatterns

def analyze_nifi_xml(xml_content: bytes) -> Report:
    try:
        xml_string = xml_content.decode('utf-8', errors="ignore")
        
        print("🚀 Iniciando el Crew de Migración de NiFi...")
        crew = MigrationCrew(xml_data=xml_string)
        ai_generated_report = crew.run()
        
        
        print("✅ Crew finalizado. Generando respuesta de la API...")

        structured_report_dict = None
        try:
            structured_report_dict = report_parser.parse_markdown_to_json(str(ai_generated_report))
            if structured_report_dict and "analisis_componentes" in structured_report_dict:
                extra_findings = antipatterns.detectar_antipatrones(structured_report_dict["analisis_componentes"])
                structured_report_dict["puntos_criticos"] = (
                    structured_report_dict.get("puntos_criticos", []) + extra_findings
                )
        except Exception as parse_err:
            print(f"No se pudo parsear el informe a JSON estructurado: {parse_err}")
        
        print("✅ Parsing completado. Generando respuesta de la API...")
        
        return Report(structured=structured_report_dict, raw_markdown=str(ai_generated_report))

    except Exception as e:
        print(f"Error durante la ejecución: {e}")
        return Report(error=f"Error fatal en el servicio: {str(e)}")
