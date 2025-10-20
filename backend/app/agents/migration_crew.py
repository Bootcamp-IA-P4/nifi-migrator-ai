from crewai import Crew, Process, Task
from .nifi_migration_agents import NifiMigrationAgents
from .nifi_migration_tasks import NifiMigrationTasks

class MigrationCrew:
    """Orchestrates the migration process using a CrewAI team.

    This class sets up the agents and tasks, defines their relationships,
    and runs the sequential process to generate a migration report.
    """
    def __init__(self, xml_data: str):
        self.xml_data = xml_data

    def run(self) -> dict:
        """Runs the migration crew and returns a dictionary with mapping JSON and final markdown report."""
        # 1. Instantiate agents and tasks
        agents = NifiMigrationAgents()
        tasks = NifiMigrationTasks()

        # 2. Define Agents (integrando el nuevo converter_agent de dev)
        analyzer_agent = agents.nifi_xml_analyzer()
        mapper_agent = agents.migration_mapper()
        converter_agent = agents.flow_converter() # Nuevo agente de dev
        reporter_agent = agents.report_generator()

        # 3. Define Tasks with correct context and dependencies (integrando conversion_task de dev)
        analysis_task = tasks.analysis_task(
            agent=analyzer_agent,
            nifi_template_content=self.xml_data
        )

        mapping_task = tasks.mapping_task(
            agent=mapper_agent,
            context=[analysis_task]
        )

        conversion_task = tasks.conversion_task(
            agent=converter_agent,
            context_task=mapping_task # Pasa mapping_task como context_task
        )

        reporting_task = tasks.reporting_task(
            agent=reporter_agent,
            context=[analysis_task, mapping_task, conversion_task] # Ahora depende también de conversion
        )

        # 4. Assemble and run the Crew (integrando el nuevo agente y tarea)
        crew = Crew(
            agents=[analyzer_agent, mapper_agent, converter_agent, reporter_agent], # Añadir converter_agent
            tasks=[analysis_task, mapping_task, conversion_task, reporting_task], # Añadir conversion_task
            process=Process.sequential,
            verbose=True
        )

        final_report_markdown = crew.kickoff().raw

        json_mapping_output = str(mapping_task.output)

        return {
            "json_mapping_str": json_mapping_output,
            "markdown_report": final_report_markdown
        }
