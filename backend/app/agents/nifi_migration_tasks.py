from crewai import Task
from .prompts import (
    ANALYSIS_TASK_DESCRIPTION,
    ANALYSIS_TASK_EXPECTED_OUTPUT,
    MAPPING_TASK_DESCRIPTION,
    MAPPING_TASK_EXPECTED_OUTPUT,
    REPORTING_TASK_DESCRIPTION,
    REPORTING_TASK_EXPECTED_OUTPUT
)

class NifiMigrationTasks:
    """
    This class defines the tasks for the NiFi migration crew.
    It separates the task definitions from the prompt details, which are
    imported from prompts.py for better maintainability.
    """
    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        """Task to analyze the NiFi 1.x XML template."""
        return Task(
            description=ANALYSIS_TASK_DESCRIPTION.format(
                nifi_template_content=nifi_template_content
            ),
            expected_output=ANALYSIS_TASK_EXPECTED_OUTPUT,
            agent=agent,
        )

    def mapping_task(self, agent, context_task: Task) -> Task:
        """Task to map NiFi 1.x components to NiFi 2.x equivalents."""
        return Task(
            description=MAPPING_TASK_DESCRIPTION,
            expected_output=MAPPING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=[context_task],
        )

    def reporting_task(self, agent, context_task: Task) -> Task:
        """Task to create a comprehensive migration report."""
        return Task(
            description=REPORTING_TASK_DESCRIPTION,
            expected_output=REPORTING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=[context_task],
        )