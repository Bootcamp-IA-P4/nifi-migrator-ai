from crewai import Task
from textwrap import dedent

class NifiMigrationTasks:
    def analysis_task(self, agent, nifi_template_content: str) -> Task:
        return Task(
            description=dedent(f"""
                As a Senior NiFi Architect, your primary task is to conduct an exhaustive analysis of the provided NiFi 1.x XML template.
                You must dissect the XML to create a detailed inventory of all its components, separating them into Processors and Controller Services.

                **Analysis Requirements:**

                1.  **Identify and List All Processors:** For each `<processor>` tag, you must extract:
                    - **ID:** The component's versioned UUID.
                    - **Name:** The user-defined name.
                    - **Type:** The full Java class path.
                    - **Properties:** A complete list of all key-value pairs within the `<properties>` tag. This is critical. List every single property.
                    - **Purpose:** A brief, one-sentence summary of what the processor does based on its type and configuration (e.g., "Fetches data via HTTP GET from a weather API.").

                2.  **Identify and List All Controller Services:** For each `<controllerService>` tag, you must extract:
                    - **ID:** The component's versioned UUID.
                    - **Name:** The user-defined name.
                    - **Type:** The full Java class path.
                    - **Properties:** A complete list of all key-value pairs within the `<properties>` tag. Pay close attention to connection details, schema definitions, etc.
                    - **Purpose:** A brief, one-sentence summary of its function (e.g., "Provides a database connection pool for PostgreSQL.").

                Here is the XML content to analyze:
                ---
                {nifi_template_content}
                ---
            """),
            expected_output=dedent("""
                A comprehensive inventory report in Markdown, written in **Spanish**.

                The report must have two main sections: "Servicios de Controlador" and "Procesadores".

                **Estructura de Salida:**

                ## Servicios de Controlador
                ---
                ### [Nombre del Servicio 1]
                - **ID:** [ID del Servicio]
                - **Tipo:** [Tipo del Servicio]
                - **Propósito:** [Resumen del propósito]
                - **Propiedades:**
                    - `key`: `value`
                    - `key`: `value`
                    ...

                ### [Nombre del Servicio 2]
                ...

                ## Procesadores
                ---
                ### [Nombre del Procesador 1]
                - **ID:** [ID del Procesador]
                - **Tipo:** [Tipo del Procesador]
                - **Propósito:** [Resumen del propósito]
                - **Propiedades:**
                    - `key`: `value`
                    - `key`: `value`
                    ...

                ### [Nombre del Procesador 2]
                ...
            """),
            agent=agent,
        )

    def mapping_task(self, agent, context_task: Task) -> Task:
        return Task(
            description=dedent("""
                You are a NiFi migration expert specializing in the transition from NiFi 1.x to 2.x.
                Using the detailed component analysis from the previous step, your task is to create a property-level migration plan for each component.

                **Mapping Requirements:**

                For each Processor and Controller Service provided, you must:
                1.  **Confirm 2.x Equivalence:** Identify the correct equivalent component type in NiFi 2.x. Note if it's a direct match, a rename (e.g., GetHTTP -> InvokeHTTP), or requires a new pattern.
                2.  **Create a Property Migration Table:** For each component, generate a table that maps every single property from the 1.x version to its 2.x counterpart.
                    - If a property is identical, state that.
                    - If a property has been renamed, specify the new name.
                    - If a property is deprecated, mark it as "Obsoleto" and explain the new approach.
                    - If a value needs to be changed or reviewed, provide a clear "Nota de Migración".

                Your analysis must be precise and actionable for a developer.
            """),
            expected_output=dedent("""
                A detailed technical mapping report in Markdown, written in **Spanish**.

                For each component from the context, generate a section with the following structure:

                ## Plan de Migración para: [Nombre del Componente]
                - **Componente en NiFi 1.x:** `[Tipo en 1.x]`
                - **Equivalente en NiFi 2.x:** `[Tipo en 2.x]`
                - **Estrategia General:** [Breve descripción: "Recrear y mapear propiedades", "Reemplazo directo", etc.]

                ### Mapeo de Propiedades
                | Propiedad en 1.x | Valor en 1.x | Propiedad en 2.x | Valor/Acción en 2.x | Notas de Migración |
                |------------------|--------------|------------------|---------------------|--------------------|
                | `property_name`  | `value`      | `new_prop_name`  | `new_value`         | [Nota si es necesaria, e.g., "Revisar formato de URL"] |
                | `another_prop`   | `old_value`  | `another_prop`   | `old_value`         | Mapeo Directo      |
                | `deprecated_prop`| `some_value` | `(Obsoleto)`     | `(N/A)`             | Esta propiedad ha sido eliminada. La funcionalidad ahora se gestiona a través de X. |
                ...
            """),
            agent=agent,
            context=[context_task],
        )

    def reporting_task(self, agent, context_task: Task) -> Task:
        return Task(
            description=dedent("""
                You are a Senior Technical Writer and NiFi Solutions Architect. Your task is to synthesize the detailed component analysis and the property-level migration mapping into a single, comprehensive, and professional migration report.
                The report must be clear, well-structured, and provide actionable insights for a technical audience.
            """),
            expected_output=dedent("""
                A final, polished migration report in Markdown, written in **Spanish**.

                The report MUST contain the following sections in order:

                1.  **Resumen Ejecutivo:** A high-level summary of the migration's scope, complexity, and the most critical actions required. Mention the number of processors and services analyzed.
                2.  **Inventario de Componentes:** A summary list of the processors and controller services found in the NiFi 1.x template.
                3.  **Plan de Migración Detallado:** This is the core of the report. Integrate the property-by-property mapping tables for each component, as generated in the previous step. Ensure it is well-formatted and easy to read.
                4.  **Puntos Críticos y Advertencias:** A bulleted list highlighting the most significant risks and challenges identified during the mapping. This should be specific, e.g., "El procesador `XYZ` es obsoleto y requiere una reimplementación manual", "La propiedad `dbcp-password` debe ser configurada de forma segura en el nuevo entorno".
                5.  **Recomendaciones y Próximos Pasos:** A clear, actionable list of next steps for the migration team, such as "1. Crear un nuevo `DBCPConnectionPool` en el entorno de NiFi 2.x...", "2. Validar las nuevas rutas de los ficheros en el procesador `PutFile`...".
            """),
            agent=agent,
            context=[context_task],
        )
