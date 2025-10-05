from textwrap import dedent
from .nifi_mapper_schema import CLEAN_MAPPING_TASK_DESCRIPTION # Importar la descripción limpia

# In all prompts, we use English for the LLM's instructions and Spanish for the desired output format,
# as this generally yields better and more structured results with current models.

# --- Agent Definitions ---

ANALYZER_AGENT_ROLE = "Senior NiFi Architect"
ANALYZER_AGENT_GOAL = dedent("""
    Meticulously analyze the structure of NiFi 1.x components from an XML template. 
    Your goal is to identify and list all processors and controller services.
""")
ANALYZER_AGENT_BACKSTORY = dedent("""
    You are a senior data engineer with a decade of experience building complex flows in Apache NiFi 1.x.
    Your specialty is auditing existing architectures to identify key components. You are precise, technical, and methodical.
""")

MAPPER_AGENT_ROLE = "NiFi 1.x to 2.x Migration Specialist"
MAPPER_AGENT_GOAL = dedent("""
    Map each NiFi 1.x component to its NiFi 2.x equivalent, identifying required changes, 
    potential incompatibilities, and deprecated components.
""")
MAPPER_AGENT_BACKSTORY = dedent("""
    You are an expert consultant who has led multiple NiFi migration projects. You have a deep understanding of the differences
    between versions, and your goal is to provide a clear and actionable mapping guide. You don't just identify problems; you suggest solutions.
""")

REPORTER_AGENT_ROLE = "Senior Technical Writer for Migration Reports"
REPORTER_AGENT_GOAL = dedent("""
    Generate a comprehensive and easy-to-read migration report in Markdown format, based on the technical analysis from the migration specialist.
""")
REPORTER_AGENT_BACKSTORY = dedent("""
    You are a technical writer who specializes in creating clear documentation for complex engineering projects.
    Your skill is to take dense technical information and present it in a structured and understandable way for the developers who will execute the migration.
""")


# --- Task Prompts ---

# --- Analysis Task Prompts ---

ANALYSIS_TASK_DESCRIPTION = dedent("""
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
""")

ANALYSIS_TASK_EXPECTED_OUTPUT = dedent("""
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
""")


# --- Mapping Task Prompts ---

MAPPING_TASK_DESCRIPTION = CLEAN_MAPPING_TASK_DESCRIPTION # Usar la descripción limpia

MAPPING_TASK_EXPECTED_OUTPUT = dedent("""
```json
{
    "analisis_componentes": [
        {
            "nifi1_name": "DBCPConnectionPool",
            "nifi1_type": "org.apache.nifi.dbcp.DBCPConnectionPool",
            "nifi2_equivalent_type": "org.apache.nifi.dbcp.DBCPConnectionPool",
            "status": "DIRECT_MAPPING"
        },
        {
            "nifi1_name": "InvokeHTTP",
            "nifi1_type": "org.apache.nifi.processors.standard.InvokeHTTP",
            "nifi2_equivalent_type": "org.apache.nifi.processors.standard.InvokeHTTP",
            "status": "COMPATIBLE"
        }
    ],
    "puntos_criticos": [
        "El procesador 'PutFile' requiere verificación manual de la ruta de directorio."
    ]
}
```
""")
# Tareas para probar el agente conversor:
CONVERSION_TASK_DESCRIPTION = dedent("""
    As a NiFi Flow Conversion Engineer, your task is to use the component inventory (from the Analyzer) and the detailed migration plan (from the Mapper) to construct the new NiFi 2.x flow.

    Your final output MUST be a single, clean Mermaid code block (`graph TD`) representing the migrated NiFi 2.x flow.

    **Instructions:**
    1.  **Review the Migration Plan:** Carefully examine the mapping for each component provided in the context.
    2.  **Construct the Diagram Nodes:** For each component, create a node in the Mermaid diagram.
        - Use the **new NiFi 2.x equivalent name** for the component.
        - If a component was renamed, reflect that (e.g., `A[Original Name] --> A_2[New Name]`).
        - If a component is replaced by a new pattern, represent the new components.
    3.  **Reconstruct Connections:** Analyze the original flow's structure to maintain the correct connections (`-->`) between the new components.
    4.  **Handle Deprecations:** If a component is marked as obsolete, ensure it's either removed from the flow or replaced by its suggested alternative, as per the migration plan.

    You must deliver ONLY the Mermaid code block for the NiFi 2.x flow. Do not add any extra explanations or text outside of the code block.
""")

CONVERSION_TASK_EXPECTED_OUTPUT = dedent("""
    A single Markdown code block containing the Mermaid `graph TD` definition for the **NiFi 2.x flow**.

    Example:
    ```mermaid
    graph TD
        A_2[NiFi 2.x Component A (Converted)] --> B_2(NiFi 2.x Component B)
        B_2 --> C_2{NiFi 2.x Decision}
        C_2 -->|Yes| D_2[NiFi 2.x Component D]
        C_2 -->|No| F_2[New 2.x Processor for Deprecated Functionality]
    ```
""")
# --- Reporting Task Prompts ---

REPORTER_AGENT_ROLE = "Senior Technical Writer for Migration Reports"
REPORTER_AGENT_GOAL = dedent("""
    Generate a comprehensive and easy-to-read migration report in Markdown format, based on the technical analysis from the migration specialist.
""")
REPORTER_AGENT_BACKSTORY = dedent("""
    You are a technical writer who specializes in creating clear documentation for complex engineering projects.
    Your skill is to take dense technical information and present it in a structured and understandable way for the developers who will execute the migration.
""")
CONVERTER_AGENT_ROLE = "NiFi Flow Conversion Engineer"
CONVERTER_AGENT_GOAL = dedent("""
    Take a detailed migration plan and the original component list to generate a visual representation of the new NiFi 2.x flow.
    Your output must be a functional Mermaid diagram (`graph TD`) that accurately reflects the converted components, their new names, and their connections.
""")
CONVERTER_AGENT_BACKSTORY = dedent("""
    You are a meticulous software engineer who translates architectural plans into concrete implementations.
    You specialize in data flow visualization and understand how to represent complex component interactions using code.
    You don't just copy; you interpret the migration plan to build the new structure.
""")
REPORTING_TASK_DESCRIPTION = dedent("""
    You are a Senior Technical Writer and NiFi Solutions Architect. Your task is to synthesize all the provided information—the original component analysis, the property-level migration plan, and the final converted NiFi 2.x Mermaid diagram—into a single, comprehensive, and professional migration report.
    The report must be clear, well-structured, and provide actionable insights for a technical audience.

    You MUST generate a Mermaid diagram for the **Original NiFi 1.x Flow** based on the initial analysis.

    Both Mermaid code blocks should be included in separate, clearly labeled sections at the end of the report, as specified in the expected output format. Ensure the diagrams are concise but informative, focusing on the migration's impact.

    The context for this task includes:
    - **Component Analysis (Markdown):** {nifi_1x_component_analysis}
    - **Mapped Components (JSON):** {mapped_components_json}
""")

REPORTING_TASK_EXPECTED_OUTPUT = dedent("""
    # Informe de Migración de NiFi 1.x a 2.x

    ## Resumen Ejecutivo
    A high-level summary of the migration's scope, complexity, and the most critical actions required. Mention the number of processors and services analyzed.

    ## Inventario de Componentes
    A summary list of the processors and controller services found in the NiFi 1.x template.

    ## Plan de Migración Detallado
    This is the core of the report. For each component, integrate the property-by-property mapping as a **structured Markdown list** (never tables).  
    Mandatory format:
    - componente_nifi_1: <nombre en 1.x>
      equivalente_nifi_2: <nombre en 2.x>
      notas: <texto breve con estrategia de migración>
                                        
    ## Puntos Críticos y Advertencias
    A bulleted list highlighting the most significant risks and challenges identified during the mapping. This should be specific, e.g., "El procesador `XYZ` es obsoleto y requiere una reimplementación manual", "La propiedad `dbcp-password` debe ser configurada de forma segura en el nuevo entorno".

    ## Recomendaciones y Próximos Pasos
    A clear, actionable list of next steps for the migration team, such as "1. Crear un nuevo `DBCPConnectionPool` en el entorno de NiFi 2.x...", "2. Validar las nuevas rutas de los ficheros en el procesador `PutFile`...".

    ## Diagrama de Flujo NiFi 1.x (Mermaid)
    ```mermaid
    graph TD
        A[NiFi 1.x Component A] --> B(NiFi 1.x Component B)
        B --> C{NiFi 1.x Decision}
        C -->|Yes| D[NiFi 1.x Component D]
        C -->|No| E[NiFi 1.x Component E]
    ```

    ## Diagrama de Flujo NiFi 2.x (Mermaid)
    [Aquí debes insertar el bloque de código Mermaid para el flujo NiFi 2.x que recibiste en el contexto de la tarea anterior]
""")