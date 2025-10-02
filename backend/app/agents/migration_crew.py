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

        # 2. Define Agents
        analyzer_agent = agents.nifi_xml_analyzer()
        mapper_agent = agents.migration_mapper()
        reporter_agent = agents.report_generator()

        # 3. Define Tasks with correct context and dependencies
        analysis_task = tasks.analysis_task(
            agent=analyzer_agent,
            nifi_template_content=self.xml_data
        )

        mapping_task = tasks.mapping_task(
            agent=mapper_agent,
            context=[analysis_task]
        )

        reporting_task = tasks.reporting_task(
            agent=reporter_agent,
            context=[analysis_task, mapping_task]
        )

        # 4. Assemble and run the Crew
        crew = Crew(
            agents=[analyzer_agent, mapper_agent, reporter_agent],
            tasks=[analysis_task, mapping_task, reporting_task],
            process=Process.sequential,
            verbose=True
        )

        # The `kickoff` method executes the crew.
        # The result is the output of the final task.
        final_report_markdown = crew.kickoff().raw

        # After kickoff, the task objects themselves contain their outputs.
        # We need the raw_output for the JSON mapping.
        json_mapping_output = str(mapping_task.output)

        return {
            "json_mapping_str": json_mapping_output,
            "markdown_report": final_report_markdown
        }