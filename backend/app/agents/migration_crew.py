import json
from crewai import Crew, Process
from .nifi_migration_agents import NifiMigrationAgents
from .nifi_migration_tasks import NifiMigrationTasks
from app.services.migration_plan_provider import migration_plan_provider

class MigrationCrew:
    """Orchestrates the migration process using a CrewAI team.

    This class sets up the agents and tasks, defines their relationships,
    and runs the sequential process to generate a migration report.
    """
    def __init__(self, xml_data: str):
        self.xml_data = xml_data

    def _get_supabase_context(self, component_names: list[str]) -> str:
        """Queries Supabase for each component and formats the results into a context string."""
        if not component_names:
            print("⚠️ No se extrajeron nombres de componentes del XML.")
            return "No se pudieron extraer componentes del XML para buscar en la base de datos."

        print(f"🔍 Buscando planes de migración en Supabase para {len(component_names)} componentes únicos...")
        parts = []
        for name in component_names:
            plan = migration_plan_provider.find_component(name)
            if plan:
                print(f"✅ Plan encontrado para: '{name}'")
                context = (
                    f"- Componente NiFi 1: {plan.get('nifi1_component')}\n"
                    f"  Estado: {plan.get('status')}\n"
                    f"  Equivalente NiFi 2: {plan.get('nifi2_equivalent')}\n"
                    f"  Cambios de Propiedad: {plan.get('property_changes', 'N/A')}\n"
                )
                parts.append(context)
        
        if not parts:
            print("ℹ️ No se encontraron planes de migración directos en Supabase.")
            return "No se encontraron equivalencias directas en la base de datos de migración para los componentes de este flujo."
        
        return "\n".join(parts)

    def run(self) -> dict:
        """Runs the migration crew and returns a dictionary with mapping JSON and final markdown report."""
        agents = NifiMigrationAgents()
        tasks = NifiMigrationTasks()

        # --- STAGE 1: Run Analysis Task to get Component Names ---
        print("--- STAGE 1: EXTRACCIÓN DE COMPONENTES ---")
        analyzer_agent = agents.nifi_xml_analyzer()
        analysis_task = tasks.analysis_task(
            agent=analyzer_agent,
            nifi_template_content=self.xml_data
        )
        
        analysis_crew = Crew(agents=[analyzer_agent], tasks=[analysis_task], verbose=True)
        analysis_output_str = analysis_crew.kickoff().raw
        
        try:
            component_data = json.loads(analysis_output_str)
            component_names = component_data.get("components", [])
            print(f"✅ Componentes extraídos: {component_names}")
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"❌ ERROR: La tarea de análisis no devolvió un JSON válido. Salida: {analysis_output_str}. Error: {e}")
            component_names = []

        # --- STAGE 2: Get Supabase context and run remaining tasks ---
        print("--- STAGE 2: ANÁLISIS DE MIGRACIÓN Y REPORTE ---")
        supabase_context = self._get_supabase_context(component_names)

        # Define remaining agents and tasks
        mapper_agent = agents.migration_mapper()
        converter_agent = agents.flow_converter()
        reporter_agent = agents.report_generator()

        # The analysis_task is passed in context to maintain the data flow chain
        mapping_task = tasks.mapping_task(
            agent=mapper_agent,
            context=[analysis_task], # Pass the first task's output as context
            supabase_context=supabase_context
        )

        conversion_task = tasks.conversion_task(
            agent=converter_agent,
            context_task=mapping_task
        )

        reporting_task = tasks.reporting_task(
            agent=reporter_agent,
            context=[analysis_task, mapping_task, conversion_task],
            supabase_context=supabase_context
        )

        # Assemble and run the main crew
        main_crew = Crew(
            agents=[mapper_agent, converter_agent, reporter_agent],
            tasks=[mapping_task, conversion_task, reporting_task],
            process=Process.sequential,
            verbose=True
        )

        final_report_markdown = main_crew.kickoff().raw
        json_mapping_output = str(mapping_task.output)

        return {
            "json_mapping_str": json_mapping_output,
            "markdown_report": final_report_markdown
        }
