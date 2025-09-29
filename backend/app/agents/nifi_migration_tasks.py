from crewai import Task
from .prompts import (
    ANALYSIS_TASK_DESCRIPTION,
    ANALYSIS_TASK_EXPECTED_OUTPUT,
    MAPPING_TASK_DESCRIPTION,
    MAPPING_TASK_EXPECTED_OUTPUT,
    REPORTING_TASK_DESCRIPTION,
    REPORTING_TASK_EXPECTED_OUTPUT
)
# 🎯 Importación clave para el RAG
from app.rag.query import get_context_for_agents

class NifiMigrationTasks:
    """
    This class defines the tasks for the NiFi migration crew.
    It separates the task definitions from the prompt details, which are
    imported from prompts.py for better maintainability.
    """
    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        """Task to analyze the NiFi 1.x XML template."""
        # 🔍 Recuperar contexto RAG para la tarea de análisis
        # La consulta se centra en las diferencias clave y la estructura del XML
        rag_query = "Diferencias y estructura del template XML de NiFi 1.x y la migración a 2.x"
        contexto_docs = get_context_for_agents(rag_query, k=5)
        
        task_description = f"""{ANALYSIS_TASK_DESCRIPTION.format(
            nifi_template_content=nifi_template_content
        )}

### Contexto de Documentación Oficial de NiFi (RAG)
{contexto_docs}
"""
        return Task(
            description=task_description,
            expected_output=ANALYSIS_TASK_EXPECTED_OUTPUT,
            agent=agent,
        )

    def mapping_task(self, agent, context_task: Task) -> Task:
        """Task to map NiFi 1.x components to NiFi 2.x equivalents."""
        # 🔍 Recuperar contexto RAG para la tarea de mapeo
        # La consulta se centra en los nombres de componentes y propiedades equivalentes
        rag_query = "Mapeo de componentes y sus propiedades de NiFi 1.28 a NiFi 2.5.0"
        contexto_docs = get_context_for_agents(rag_query, k=5)

        task_description = f"""{MAPPING_TASK_DESCRIPTION}

### Contexto de Documentación Oficial de NiFi (RAG)
{contexto_docs}
"""
        return Task(
            description=task_description,
            expected_output=MAPPING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            # Asegura que el resultado del análisis anterior esté disponible
            context=[context_task],
        )

    def reporting_task(self, agent, context_task: Task) -> Task:
        """Task to create a comprehensive migration report."""
        # Para la tarea de reporte, generalmente es suficiente con el contexto de las tareas anteriores, 
        # ya que su objetivo es consolidar.
        return Task(
            description=REPORTING_TASK_DESCRIPTION,
            expected_output=REPORTING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=[context_task],
        )