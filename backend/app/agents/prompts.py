from textwrap import dedent

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

MAPPING_TASK_DESCRIPTION = dedent("""
    You are a NiFi migration expert specializing in the transition from NiFi 1.x to 2.x.
    Using the detailed component analysis from the previous step, your task is to generate a JSON object representing the migration plan for each component.

    **NiFi 1.x Component Analysis (from Analyzer Agent):**

    ---

    {nifi_1x_component_analysis}

    ---

    **Mapping Requirements:**

    For each Processor and Controller Service identified in the `NiFi 1.x Component Analysis`:

    1.  **Infer Equivalence:** Identify the correct equivalent component type in NiFi 2.x. If a direct equivalent is not found, state `null`.
    2.  **Property Mapping:** For each property, map its 1.x name and value to its 2.x equivalent. If a property is deprecated, mark it as `deprecated` and suggest an alternative. If a property is new, add it.
    3.  **Migration Notes:** Provide concise notes on the migration strategy for the component and its properties.
    4.  **Status:** Assign a status like `DIRECT_MAPPING`, `RENAMED`, `DEPRECATED`, `MANUAL_REVIEW_REQUIRED`.

    Your output MUST be a valid JSON object, containing a list of mapped components. DO NOT include any conversational text, explanations, or Markdown outside the JSON.
""")

MAPPING_TASK_EXPECTED_OUTPUT = dedent("""
{
    "analisis_componentes": [
        {
            "nifi1_id": "uuid-of-component-1",
            "nifi1_name": "My NiFi 1.x Processor",
            "nifi1_type": "org.apache.nifi.processors.standard.GetHTTP",
            "nifi1_properties": {
                "URL": "http://example.com",
                "Method": "GET"
            },
            "nifi2_equivalent_type": "org.apache.nifi.processors.standard.InvokeHTTP",
            "status": "RENAMED",
            "migration_notes": "GetHTTP was replaced by InvokeHTTP. Properties are mostly compatible.",
            "property_mappings": [
                {"nifi1_prop": "URL", "nifi1_value": "http://example.com", "nifi2_prop": "Remote URL", "nifi2_value": "http://example.com", "notes": "Direct mapping"},
                {"nifi1_prop": "Method", "nifi1_value": "GET", "nifi2_prop": "HTTP Method", "nifi2_value": "GET", "notes": "Direct mapping"}
            ]
        },
        {
            "nifi1_id": "uuid-of-component-2",
            "nifi1_name": "My Custom Processor",
            "nifi1_type": "com.example.nifi.CustomProcessor",
            "nifi1_properties": {
                "CustomProperty": "Value"
            },
            "nifi2_equivalent_type": null,
            "status": "MANUAL_REVIEW_REQUIRED",
            "migration_notes": "Custom processor not found in NiFi 2.x. Requires manual review for replacement strategy.",
            "property_mappings": []
        }
    ],
    "puntos_criticos": [
        "El procesador 'My Custom Processor' requiere revisión manual."
    ]
}
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

REPORTING_TASK_DESCRIPTION = dedent("""
    You are a Senior Technical Writer and NiFi Solutions Architect. Your task is to synthesize the detailed component analysis (from the Analyzer Agent) and the property-level migration mapping (from the Mapper Agent) into a single, comprehensive, and professional migration report.
    The report must be clear, well-structured, and provide actionable insights for a technical audience.

    Crucially, you MUST generate TWO distinct Mermaid diagrams (using `graph TD` for a top-down flow) to visually represent the migration:
    1.  **Original NiFi 1.x Flow Diagram:** Illustrate the main processors and controller services of the original NiFi 1.x flow, showing their connections and data flow. Use the component IDs and names from the Analyzer Agent's report.
    2.  **Migrated NiFi 2.x Flow Diagram:** Illustrate the corresponding NiFi 2.x flow. This diagram should reflect the changes identified by the Mapper Agent, including:
        *   Renamed components.
        *   New equivalent components.
        *   How deprecated/removed 1.x components are replaced or handled in 2.x (e.g., "Deprecated 1.x Processor" --> "New 2.x Approach").
        *   Maintain connections and data flow logic.

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
    ```mermaid
    graph TD
        A_2[NiFi 2.x Component A (Renamed)] --> B_2(NiFi 2.x Component B)
        B_2 --> C_2{NiFi 2.x Decision}
        C_2 -->|Yes| D_2[NiFi 2.x Component D]
        C_2 -->|No| E_2[NiFi 2.x Component E (New Approach)]
        E_2 --> F_2[New 2.x Processor for Deprecated Functionality]
    ```
""")