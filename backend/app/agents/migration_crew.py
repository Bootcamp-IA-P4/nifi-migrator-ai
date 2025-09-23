# backend/app/migration_crew.py
from crewai import Crew, Process
from .nifi_migration_agents import NifiMigrationAgents
from .nifi_migration_tasks import NifiMigrationTasks
from app.services.report_parser import parse_markdown_to_json
from app.models.report import Report

class MigrationCrew:
    def __init__(self, xml_data: str):
        self.xml_data = xml_data

    def run(self):
        agents = NifiMigrationAgents()
        tasks = NifiMigrationTasks()

        analyzer_agent = agents.nifi_xml_analyzer()
        mapper_agent = agents.migration_mapper()
        reporter_agent = agents.report_generator()

        analysis = tasks.analysis_task(analyzer_agent, self.xml_data)
        mapping = tasks.mapping_task(mapper_agent, analysis)
        reporting = tasks.reporting_task(reporter_agent, mapping)

        crew = Crew(
            agents=[analyzer_agent, mapper_agent, reporter_agent],
            tasks=[analysis, mapping, reporting],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff()

        try:
            structured = parse_markdown_to_structured(result)
            return Report(report=structured)
        except Exception as e:
            return Report(error=f"Error al parsear reporte: {str(e)}")
