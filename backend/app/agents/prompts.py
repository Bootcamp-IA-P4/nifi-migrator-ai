from textwrap import dedent

# In all prompts, we use English for the LLM's instructions and Spanish for the desired output format,
# as this generally yields better and more structured results with current models.

# --- Agent Definitions ---

ANALYZER_AGENT_ROLE = "Senior NiFi Architect"
ANALYZER_AGENT_GOAL = dedent("""
    Meticulously analyze the structure of a NiFi 1.x XML template.
    Your goal is to create a complete inventory of all processors, controller services, and their connections.
""")
ANALYZER_AGENT_BACKSTORY = dedent("""
    You are a senior data engineer with a decade of experience building complex flows in Apache NiFi 1.x.
    Your specialty is auditing existing architectures to identify key components and understand data flow paths. You 
are precise, technical, and methodical.
""")

MAPPER_AGENT_ROLE = "NiFi 1.x to 2.x Migration Specialist"
MAPPER_AGENT_GOAL = dedent("""
    Map each NiFi 1.x component to its NiFi 2.x equivalent using a provided knowledge base (CSV).
    You must identify required changes, flag components needing manual review, and provide detailed migration 
guidance in JSON format.
""")
MAPPER_AGENT_BACKSTORY = dedent("""
    You are an expert consultant who has led multiple NiFi migration projects. You have a deep understanding of the 
differences
    between versions. You rely on your expertise to infer mappings. If a component is unknown to you,
    you flag it for manual review. Your output must be a clean, valid JSON object.
""")

REPORTER_AGENT_ROLE = "Senior Technical Writer for Migration Reports"
REPORTER_AGENT_GOAL = dedent("""
    Generate a comprehensive and easy-to-read migration assessment report in Markdown format.
    The report must include a visual diagram of the original flow using Mermaid, and present the migration analysis 
clearly.
""")
REPORTER_AGENT_BACKSTORY = dedent("""
    You are a technical writer who specializes in creating clear documentation for complex engineering projects.
    Your skill is to take dense technical information (component analysis, mappings in JSON, connections) and present
it in a structured,
    visually-appealing, and understandable way for the developers who will execute the migration.
""")


# --- Task Prompts ---

# --- Analysis Task Prompts ---

ANALYSIS_TASK_DESCRIPTION = dedent("""
    As a Senior NiFi Architect, your primary task is to conduct an exhaustive analysis of the provided NiFi 1.x XML 
template.
    You must dissect the XML to create a detailed inventory of all its components and their relationships.

    **Analysis Requirements:**

    1.  **Identify Processors and Controller Services:** For each `<processor>` and `<controllerService>`, extract:
        - **ID:** The component's versioned UUID.
        - **Name:** The user-defined name.
        - **Type:** The full Java class path (e.g., `org.apache.nifi.processors.standard.GetHTTP`).
        - **Properties:** A complete list of all key-value pairs within the `<properties>` tag.

    2.  **Identify Connections:** For each `<connection>` tag, extract:
        - **Source ID:** The UUID of the source component.
        - **Destination ID:** The UUID of the destination component.
        - **Name:** The name of the connection (often representing a relationship like "success", 
"failure").

    Here is the XML content to analyze:
    ---
    {nifi_template_content}
    ---
""")

ANALYSIS_TASK_EXPECTED_OUTPUT = dedent("""
    A comprehensive inventory report in Markdown, written in **Spanish**.\n
    The report must have three main sections: \"Servicios de Controlador\", \"Procesadores\", and 
\"Conexiones\".\n
    **Estructura de Salida:**\n
    ## Servicios de Controlador\n
    ---\n
    ### [Nombre del Servicio 1]\n
    - **ID:** [ID del Servicio]\n
    - **Tipo:** [Tipo del Servicio]\n
    - **Propiedades:**\n
        - `key`: `value`\n
        ...

    ## Procesadores\n
    ---\n
    ### [Nombre del Procesador 1]\n
    - **ID:** [ID del Procesador]\n
    - **Tipo:** [Tipo del Procesador]\n
    - **Propiedades:**\n
        - `key`: `value`\n
        ...

    ## Conexiones\n
    ---\n
    - **De:** [ID Origen] -> **A:** [ID Destino] (Relación: [Nombre Conexión])\n
    ...\n""")


# --- Mapping Task Prompts ---

MAPPING_TASK_DESCRIPTION = dedent("""
    You are a NiFi migration expert. Your task is to map each NiFi 1.x component from the provided **concise 
analysis** to its NiFi 2.x equivalent.
    You will use your general knowledge of NiFi 1.x to 2.x migrations to infer a mapping for every component.

    **NiFi 1.x Concise Component Analysis (from Analyzer Agent):**

    ---

    {nifi_1x_component_analysis}

    ---

    **Mapping Requirements:**

    For each Processor and Controller Service identified in the `NiFi 1.x Concise Component Analysis`:

    1.  **Infer Equivalence with LLM:** Use your general knowledge of NiFi 1.x to 2.x changes to infer the 
`nifi2_equivalent_type`, `migration_notes`, `property_changes_summary`, and `recommended_config_summary`. Set `status` 
to "LLM_INFERRED". Set `mapping_source` to "LLM_INFERRED".

    2.  **Handle Unknown Components:** If you cannot infer a plausible equivalent even with your general knowledge, set 
`nifi2_equivalent_type` to `null` and `status` to "MANUAL_REVIEW_REQUIRED". Provide a generic note like "Componente no 
inferido por LLM. Requiere revisión manual.". Set `mapping_source` to "NONE".

    3.  **Handle Deprecated/Removed Components:** If you know from your expertise that a component was deprecated or 
removed in NiFi 2.x without a direct replacement, set `status` to `DEPRECATED` or `REMOVED` accordingly. Provide 
notes explaining the situation.

    4.  **Extract Properties:** Include the original `nifi1_properties` as an object.

    Your output MUST be a valid JSON object, containing a list of mapped components.
    DO NOT include any conversational text, explanations, or Markdown outside the JSON.
""")

MAPPING_TASK_EXPECTED_OUTPUT = dedent("""
{
    "mapped_components": [
        {
            "nifi1_id": "uuid-of-component-1",
            "nifi1_name": "My NiFi 1.x Processor",
            "nifi1_type": "org.apache.nifi.processors.standard.GetHTTP",
            "nifi1_properties": {
                "URL": "http://example.com",
                "Method": "GET"
            },
            "nifi2_equivalent_type": "org.apache.nifi.processors.standard.InvokeHTTP",
            "status": "LLM_INFERRED",
            "mapping_source": "LLM_INFERRED",
            "migration_notes": "GetHTTP fue reemplazado por InvokeHTTP. Se infiere que las propiedades son compatibles pero se recomienda revisar la configuración del proxy.",
            "source_document": null,
            "property_changes_summary": "Propiedades Proxy eliminadas, usar Proxy Configuration Service.",
            "recommended_config_summary": "Usar InvokeHTTP con propiedades: HTTP Method=GET, Remote URL=https://..."
        },
        {
            "nifi1_id": "uuid-of-component-2",
            "nifi1_name": "My Custom Processor",
            "nifi1_type": "com.example.nifi.CustomProcessor",
            "nifi1_properties": {
                "CustomProperty": "Value"
            },
            "nifi2_equivalent_type": "org.apache.nifi.processors.standard.ExecuteScript",
            "status": "LLM_INFERRED",
            "mapping_source": "LLM_INFERRED",
            "migration_notes": "Componente personalizado. Se infiere que podría ser reemplazado por ExecuteScript para lógica custom. Requiere revisión manual para confirmar la lógica.",
            "source_document": null,
            "property_changes_summary": "La lógica custom deberá ser reescrita en Groovy o Python.",
            "recommended_config_summary": "Evaluar la funcionalidad del CustomProcessor y reescribirla usando ExecuteScript (Groovy) o la nueva API de Python."
        },
        {
            "nifi1_id": "uuid-of-component-3",
            "nifi1_name": "Unknown Processor",
            "nifi1_type": "com.unknown.nifi.UnknownProcessor",
            "nifi1_properties": {},
            "nifi2_equivalent_type": null,
            "status": "MANUAL_REVIEW_REQUIRED",
            "mapping_source": "NONE",
            "migration_notes": "Componente no inferido por LLM. Requiere revisión manual.",
            "source_document": null,
            "property_changes_summary": null,
            "recommended_config_summary": null
        }
    ]
}
""")


# --- Reporting Task Prompts ---

REPORTING_TASK_DESCRIPTION = dedent("""
    You are a Senior Technical Writer. Your task is to synthesize the component inventory (from the Analyzer Agent),
    the connection data (from the Analyzer Agent), and the migration mapping plan (in JSON format from the Mapper 
Agent)
    into a single, comprehensive, and professional migration assessment report in Markdown format.

    **Input Data:**
    - **NiFi 1.x Component Analysis (Markdown):** {nifi_1x_component_analysis}
    - **Mapped Components (JSON):** {mapped_components_json}
    - **NiFi 1.x Connections (JSON or similar structured format):** {nifi_1x_connections}

    **Report Generation Requirements:**

    1.  **Structure the Report:** Follow the structure defined in the "Expected Output".
    2.  **Generate Mermaid Diagram:** Using the **component IDs and names** from the `NiFi 1.x Component Analysis` and
the `NiFi 1.x Connections` data, create a Mermaid `graph TD` diagram that visually represents the NiFi 1.x flow. The 
diagram should use the component names as labels for the nodes, and IDs for internal referencing.
    3.  **Integrate Mapped Components:** Create a detailed table in Markdown for the "Plan de Migración Detallado" 
section, using the `mapped_components_json` data. Ensure all relevant fields (NiFi 1.x Type, NiFi 2.x Equivalent, 
Status, Migration Notes, etc.) are clearly presented.
    4.  **Highlight Critical Points:** Extract all components with `status` "MANUAL_REVIEW_REQUIRED", 
"DEPRECATED", or "REMOVED" from the `mapped_components_json` and list them under "Puntos Críticos y 
Advertencias".

    The final output MUST be a single, clean Markdown document.
""")

REPORTING_TASK_EXPECTED_OUTPUT = dedent("""
# Informe de Asesoramiento de Migración de NiFi 1.x a 2.x

## Resumen del Flujo Analizado
- **Número de Procesadores:** [Contar procesadores]
- **Número de Servicios de Controlador:** [Contar servicios]

## Diagrama de Flujo (NiFi 1.x)
```mermaid
graph TD
    id1[Nombre Procesador 1] --> |Relación| id2[Nombre Procesador 2]
    id2 --> id3[Nombre Procesador 3]
    classDef processor fill:#26a69a,stroke:#FFFFFF,stroke-width:2px;
    class id1,id2,id3 processor;
```

## Plan de Migración Detallado
---
| Componente NiFi 1.x (Tipo) | Equivalente NiFi 2.x (Tipo) | Estado | Notas de Migración | Documentación Fuente |
|----------------------------|-----------------------------|--------|--------------------|----------------------|
| `org.apache.nifi.processors.standard.GetHTTP` | `org.apache.nifi.processors.standard.InvokeHTTP` | LLM_INFERRED 
| GetHTTP fue reemplazado por InvokeHTTP. Ajustar propiedades. | `null` |
| `com.example.nifi.CustomProcessor` | `null` | MANUAL_REVIEW_REQUIRED | Componente no encontrado en la base de 
conocimiento. Requiere revisión manual. | `null` |
...

## Puntos Críticos y Advertencias
### Componentes que Requieren Revisión Manual:
- **My Custom Processor (`com.example.nifi.CustomProcessor`):** Componente no encontrado en la base de conocimiento. 
Requiere revisión manual.
### Componentes Obsoletos o Eliminados:
- **Deprecated Processor (`org.apache.nifi.processors.processors.standard.ConvertJSONToSQL`):** Se infiere que este componente ha sido eliminado.

## Próximos Pasos Recomendados
1.  Revisar los componentes marcados para **revisión manual** y definir una estrategia de migración para cada uno.
2.  Planificar la reimplementación de la funcionalidad de los componentes **obsoletos** o **eliminados**.
3.  Proceder con la creación de los flujos en NiFi 2.x para los componentes con **mapeo automático**.
4.  Consultar la documentación fuente proporcionada para cada componente para detalles adicionales.
""")
