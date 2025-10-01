from crewai import Task
from typing import List
from .prompts import (
    ANALYSIS_TASK_DESCRIPTION,
    ANALYSIS_TASK_EXPECTED_OUTPUT,
    MAPPING_TASK_DESCRIPTION,
    MAPPING_TASK_EXPECTED_OUTPUT,
    REPORTING_TASK_DESCRIPTION,
    REPORTING_TASK_EXPECTED_OUTPUT
)
from app.rag.query import get_context_for_agents

class NifiMigrationTasks:
    """
    This class defines the tasks for the NiFi migration crew.
    """
    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        """Task to analyze the NiFi 1.x XML template.
        This is the first task and receives the initial XML content.
        """
        rag_query = "Diferencias y estructura del template XML de NiFi 1.x y la migración a 2.x"
        contexto_docs = get_context_for_agents(rag_query, k=5)
        
        # 1. Formatear la descripción base por separado para evitar la sintaxis incompleta.
        formatted_analysis_desc = ANALYSIS_TASK_DESCRIPTION.format(
            nifi_template_content=nifi_template_content
        )
        
        # 2. Concatenar la descripción formateada con el contexto RAG.
        task_description = (
            f"{formatted_analysis_desc}\n\n"
            f"### Contexto de Documentación Oficial de NiFi (RAG)\n"
            f"{contexto_docs}"
        )
        
        return Task(
            description=task_description,
            expected_output=ANALYSIS_TASK_EXPECTED_OUTPUT,
            agent=agent,
        )

    def mapping_task(self, agent, context: List[Task]) -> Task:
        """Task to map NiFi 1.x components to NiFi 2.x equivalents.
        This task depends on the output of the analysis_task.
        """
        rag_query = "Mapeo de componentes y sus propiedades de NiFi 1.28 a NiFi 2.5.0"
        contexto_docs = get_context_for_agents(rag_query, k=5)

        # The description is NOT formatted with data here.
        # CrewAI will automatically inject the output from the context tasks
        # into the {placeholders} in the MAPPING_TASK_DESCRIPTION prompt.
        task_description = (
            f"{MAPPING_TASK_DESCRIPTION}\n\n"
            f"### Contexto de Documentación Oficial de NiFi (RAG)\n"
            f"{contexto_docs}"
        )

        return Task(
            description=task_description,
            expected_output=MAPPING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=context  # Pass the context to the Task object
        )

    def reporting_task(self, agent, context: List[Task]) -> Task:
        """Task to create a comprehensive migration report.
        This task depends on the outputs of the analysis and mapping tasks.
        """
        # Similar to the mapping task, the description is not formatted here.
        # CrewAI will inject the outputs from the context tasks into the placeholders
        # like {nifi_1x_component_analysis} and {mapped_components_json}.
        return Task(
            description=REPORTING_TASK_DESCRIPTION,
            expected_output=REPORTING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=context  # Pass the context to the Task object
        )
