MAPPING_JSON_SCHEMA = {
  "type": "object",
  "properties": {
    "analisis_componentes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "nifi1_name": {"type": "string", "description": "Nombre del componente NiFi 1.x"},
          "nifi1_type": {"type": "string", "description": "Tipo de clase Java del componente NiFi 1.x"},
          "nifi2_equivalent_type": {"type": ["string", "null"], "description": "Tipo equivalente en NiFi 2.x, o null si no hay equivalencia directa"},
          "status": {"type": "string", "enum": ["DIRECT_MAPPING", "RENAMED", "DEPRECATED", "MANUAL_REVIEW_REQUIRED", "COMPATIBLE", "CONFIGURATION_ADJUSTMENT_REQUIRED"], "description": "Estado de la migración"}
        },
        "required": ["nifi1_name", "nifi1_type", "nifi2_equivalent_type", "status"]
      }
    },
    "puntos_criticos": {
      "type": "array",
      "items": {"type": "string", "description": "Descripción de un punto crítico o advertencia"}
    }
  },
  "required": ["analisis_componentes", "puntos_criticos"]
}

CLEAN_MAPPING_TASK_DESCRIPTION = """
You are a NiFi migration expert specializing in the transition from NiFi 1.x to 2.x.
Using the detailed component analysis from the previous step, your task is to generate a JSON object representing the migration plan for each component.

**NiFi 1.x Component Analysis (from Analyzer Agent):**
---
{nifi_1x_component_analysis}
---

**Mapping Requirements:**
For each Processor and Controller Service identified, infer the NiFi 2.x equivalent, and assign a clear migration status.

Your output MUST be a valid JSON object, and ONLY the JSON object. Do NOT include any conversational text, explanations, or Markdown outside the JSON. The structure MUST adhere strictly to the JSON Schema provided in the API call.

Wrap your JSON output in a Markdown code block like this:
```json
[YOUR JSON HERE]
```

"""