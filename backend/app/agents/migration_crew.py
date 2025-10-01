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

    def run(self) -> str:
        """Runs the migration crew and returns the final markdown report."""
        # 1. Instantiate agents and tasks
        agents = NifiMigrationAgents()
        tasks = NifiMigrationTasks()

        # 2. Define Agents
        analyzer_agent = agents.nifi_xml_analyzer()
        mapper_agent = agents.migration_mapper()
        reporter_agent = agents.report_generator()

        # 3. Define Tasks with correct context and dependencies
        # The `analysis_task` is the first step, taking the raw XML data.
        analysis_task = tasks.analysis_task(
            agent=analyzer_agent,
            nifi_template_content=self.xml_data
        )

        # The `mapping_task` depends on the output of the `analysis_task`.
        # Its context will be automatically populated by CrewAI.
        mapping_task = tasks.mapping_task(
            agent=mapper_agent,
            # This task will receive the output of `analysis_task` as context
            context=[analysis_task]
        )

        # The `reporting_task` depends on the outputs of both previous tasks.
        reporting_task = tasks.reporting_task(
            agent=reporter_agent,
            # This task receives the outputs of both tasks as context
            context=[analysis_task, mapping_task]
        )

        # 4. Assemble and run the Crew
        crew = Crew(
            agents=[analyzer_agent, mapper_agent, reporter_agent],
            tasks=[analysis_task, mapping_task, reporting_task],
            process=Process.sequential, # Tasks will run in the order they are defined
            verbose=True
        )

        # The `kickoff` method executes the crew and returns the output of the final task.
        result = crew.kickoff()
        return result
