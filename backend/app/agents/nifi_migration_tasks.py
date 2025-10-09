from crewai import Task
from typing import List

# Prompts base
from .prompts import (
    ANALYSIS_TASK_DESCRIPTION,
    ANALYSIS_TASK_EXPECTED_OUTPUT,
    MAPPING_TASK_DESCRIPTION,
    MAPPING_TASK_EXPECTED_OUTPUT,
    CONVERSION_TASK_DESCRIPTION,
    CONVERSION_TASK_EXPECTED_OUTPUT,
    REPORTING_TASK_DESCRIPTION,
    REPORTING_TASK_EXPECTED_OUTPUT,
)

# ✅ Nuevo import del RAG combinado
from app.rag.rag_combined import get_combined_context


class NifiMigrationTasks:
    """
    Define the sequence of AI-driven tasks for NiFi 1.x → 2.x migration.
    Now enhanced with combined RAG (templates + official PDFs from Supabase).
    """

    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        """🔍 Step 1: Analyze the NiFi 1.x XML template."""
        rag_query = "Diferencias y estructura del template XML de NiFi 1.x y la migración a 2.x"
        contexto_docs = get_combined_context(rag_query, k=5)

        formatted_analysis_desc = ANALYSIS_TASK_DESCRIPTION.format(
            nifi_template_content=nifi_template_content
        )

        task_description = (
            f"{formatted_analysis_desc}\n\n"
            f"### Contexto de Documentación Oficial y Embeddings RAG\n"
            f"{contexto_docs}"
        )

        return Task(
            description=task_description,
            expected_output=ANALYSIS_TASK_EXPECTED_OUTPUT,
            agent=agent,
        )

    def mapping_task(self, agent, context: List[Task]) -> Task:
        """🧩 Step 2: Map NiFi 1.x components to NiFi 2.x equivalents."""
        rag_query = "Mapeo de componentes y propiedades de NiFi 1.28 a NiFi 2.5.0"
        contexto_docs = get_combined_context(rag_query, k=5)

        task_description = (
            f"{MAPPING_TASK_DESCRIPTION}\n\n"
            f"### Contexto de Documentación Oficial y Embeddings RAG\n"
            f"{contexto_docs}"
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

    def reporting_task(self, agent, context: List[Task]) -> Task:
        """📝 Step 4: Generate the full migration report."""
        rag_query = "Buenas prácticas, patrones y anti-patrones en flujos NiFi"
        contexto_docs = get_combined_context(rag_query, k=5)

        task_description = (
            f"{REPORTING_TASK_DESCRIPTION}\n\n"
            f"### Contexto de Documentación Oficial y Embeddings RAG\n"
            f"{contexto_docs}"
        )

        return Task(
            description=task_description,
            expected_output=REPORTING_TASK_EXPECTED_OUTPUT,
            agent=agent,
            context=context,
        )
