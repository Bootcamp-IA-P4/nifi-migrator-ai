from crewai import Task
from textwrap import dedent

# Este archivo es el lugar donde definimos tareas para nuestros agentes.
# Cada tarea está metida aquí pero se pueden pasar a un archivo separado de prompst y llamarse desde aquí.

class NifiMigrationTasks:
    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        return Task(
            description=dedent(f"""
                As an expert NiFi 1.x architect, your task is to conduct a detailed inventory of the provided NiFi XML template.
                You must meticulously analyze the XML content and identify every processor and controller service.

                For EACH component you find, you MUST extract the following specific pieces of information:
                1.  **Component ID:** The unique UUID of the component.
                2.  **Component Name:** The user-defined name (e.g., "Get API Data").
                3.  **Component Type:** The full Java class path (e.g., "org.apache.nifi.processors.standard.GetHTTP").

                Here is the XML content to analyze:
                ---
                {nifi_template_content}
                ---
            """),
            expected_output=dedent("""
                A detailed inventory report formatted in Markdown.
                The final report MUST be written in **Spanish**.

                For each component, create a section with the following structure:

                ### Componente: [Component Name]
                - **ID:** [Component ID]
                - **Tipo:** [Component Type]
            """),
            agent=agent,
        )

    def mapping_task(self, agent, context_task: Task) -> Task:
        return Task(
            description=dedent("""You are a NiFi migration specialist. Using the component analysis from the previous step, your job is to map each NiFi 1.x component to its NiFi 2.x equivalent.

                For each component provided in the context, you must determine its migration path:
                1.  **Direct Migration:** The component exists in NiFi 2.x with the same type and requires no changes.
                2.  **Rename/Replace:** The component has been renamed or replaced by a new, different component in NiFi 2.x (e.g., GetHTTP is now InvokeHTTP).
                3.  **Obsolete:** The component no longer exists in NiFi 2.x and requires a completely new strategy.

                Provide clear reasons for your mapping decisions.
            """),
            expected_output=dedent("""
                A technical mapping report in Markdown format. The final report MUST be written in **Spanish**.

                The output must be a table with the following columns:
                - Componente en NiFi 1.x (Tipo)
                - Equivalente en NiFi 2.x (Tipo)
                - Estrategia de Migración (Directa, Renombrar, Obsoleta)
                - Notas Clave
            """),
            agent=agent,
            context=[context_task],
        )

    def reporting_task(self, agent, context_task: Task) -> Task:
        return Task(
            description=dedent("""You are a senior technical writer. Your task is to synthesize the component analysis and the migration mapping into a single, comprehensive, and professional migration report.
                The report should be well-structured, clear, and targeted at a technical audience of developers and project managers.

                You MUST use the information from the previous steps to build the report.
            """),
            expected_output=dedent("""
                A final, polished migration report in Markdown format. The final report MUST be written in **Spanish**.

                The report MUST contain the following sections, in this order:

                1.  **Resumen Ejecutivo:** A brief, high-level summary of the migration complexity and key findings.
                2.  **Análisis de Componentes:** A list of all identified NiFi 1.x components.
                3.  **Plan de Migración y Mapeo:** The detailed mapping table created in the previous step.
                4.  **Puntos Críticos y Advertencias:** A bulleted list of the most significant risks or challenges (e.g., obsolete components, complex reconfigurations).
                5.  **Recomendaciones Finales:** Actionable next steps for the development team.
            """),
            agent=agent,
            context=[context_task],
        )
