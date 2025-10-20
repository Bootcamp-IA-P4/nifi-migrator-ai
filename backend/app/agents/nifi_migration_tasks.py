from crewai import Task
from typing import List

# Prompts base
from .prompts import (
    # ANALYSIS_TASK_DESCRIPTION,  <- No longer a complex task
    # ANALYSIS_TASK_EXPECTED_OUTPUT, <- Will be defined directly
    MAPPING_TASK_DESCRIPTION,
    MAPPING_TASK_EXPECTED_OUTPUT,
    CONVERSION_TASK_DESCRIPTION,
    CONVERSION_TASK_EXPECTED_OUTPUT,
    REPORTING_TASK_DESCRIPTION,
    REPORTING_TASK_EXPECTED_OUTPUT,
)

# ✅ Nuevo import del RAG combinado
from app.rag.rag_combined import get_combined_context

# Define the new, simplified analysis task description directly
ANALYSIS_TASK_DESCRIPTION = (
    "Analiza el siguiente contenido de un template XML de NiFi 1.x. "
    "Tu única y exclusiva tarea es identificar todos los procesadores y extraer sus nombres. "
    "Debes devolver un objeto JSON con una única clave 'components', que contenga una lista de los nombres de los procesadores encontrados. "
    "Asegúrate de que la lista no contenga nombres duplicados.\n\n"
    "XML a analizar:\n"
    "'''{nifi_template_content}'''"
)


class NifiMigrationTasks:
    """
    Define the sequence of AI-driven tasks for NiFi 1.x → 2.x migration.
    """

    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        """🔍 Step 1: Parse the NiFi 1.x XML and extract component names."""
        return Task(
            description=ANALYSIS_TASK_DESCRIPTION.format(
                nifi_template_content=nifi_template_content
            ),
            expected_output="Un objeto JSON con una clave 'components' que contiene una lista de strings. Ejemplo: {\"components\": [\"GenerateFlowFile\", \"LogAttribute\"]}",
            agent=agent,
        )

    def mapping_task(self, agent, context: List[Task], supabase_context: str) -> Task:
        """🧩 Step 2: Map NiFi 1.x components to NiFi 2.x equivalents."""
        rag_query = "Mapeo de componentes y propiedades de NiFi 1.28 a NiFi 2.5.0"
        docs_context = get_combined_context(rag_query, k=5)

        task_description = (
            f"{MAPPING_TASK_DESCRIPTION}\n\n"
            f"### Contexto de Equivalencias Directas (Base de Datos):\n"
            f"'''{supabase_context}'''\n\n"
            f"### Contexto Adicional (Documentación RAG):\n"
            f"'''{docs_context}'''"
        )

        return Task(
            description=task_description,
            expected_output=MAPPING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=context,
        )

    def conversion_task(self, agent, context_task: Task) -> Task:
        """⚙️ Step 3: Generate the NiFi 2.x flow in Mermaid format."""
        return Task(
            description=CONVERSION_TASK_DESCRIPTION,
            expected_output=CONVERSION_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=[context_task],
        )

    def reporting_task(self, agent, context: List[Task], supabase_context: str) -> Task:
        """📝 Step 4: Generate the full migration report."""
        rag_query = "Buenas prácticas, patrones y anti-patrones en flujos NiFi"
        docs_context = get_combined_context(rag_query, k=5)

        task_description = (
            f"{REPORTING_TASK_DESCRIPTION}\n\n"
            f"### Contexto de Equivalencias Directas (Base de Datos):\n"
            f"'''{supabase_context}'''\n\n"
            f"### Contexto Adicional (Documentación RAG):\n"
            f"'''{docs_context}'''"
        )

        return Task(
            description=task_description,
            expected_output=REPORTING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=context,
        )
