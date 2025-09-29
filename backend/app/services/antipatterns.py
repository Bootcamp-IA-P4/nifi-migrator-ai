from typing import List, Dict

ANTIPATTERNS = [
    {
        "name": "shredding_and_reconstituting",
        "check": lambda comp: comp.get("type") in ["SplitText", "MergeContent"],
        "message": "Se detecta patrón de dividir y luego recomponer (Shredding and Reconstituting). Recomendado usar procesadores basados en registros."
    },
    {
        "name": "regex_on_unstructured",
        "check": lambda comp: comp.get("type") in ["RouteOnContent", "ExtractText"],
        "message": "Uso de Regex sobre datos no estructurados. Recomendado usar procesadores record-based con parsers."
    },
    {
        "name": "attributes_vs_content",
        "check": lambda comp: "UpdateAttribute" in comp.get("type", ""),
        "message": "Posible confusión entre atributos y contenido. Mantener atributos como metadatos separados del contenido."
    },
    {
        "name": "funnels_as_storage",
        "check": lambda comp: comp.get("type") == "Funnel",
        "message": "Uso de Funnels como almacenamiento intermedio. Riesgo de dead-ends."
    },
    {
        "name": "spaghetti_flow",
        "check": lambda comp: comp.get("layout_issue", False),
        "message": "Diseño de flujo enmarañado (spaghetti flow). Recomendado organizar top-down o left-right con labels."
    },
    {
        "name": "load_balancing_misuse",
        "check": lambda comp: comp.get("load_balance") == "compressed",
        "message": "Mala configuración de Load Balancing. Evitar compresión y redundancia en balanceo."
    },
]

def detectar_antipatrones(components: List[Dict]) -> List[str]:
    
    findings = []
    for comp in components:
        for rule in ANTIPATTERNS:
            try:
                if rule["check"](comp):
                    nombre = comp.get("name", comp.get("id", "Componente desconocido"))
                    findings.append(f"- {rule['message']} (Componente: {nombre})")
            except Exception:
                continue
    return findings
