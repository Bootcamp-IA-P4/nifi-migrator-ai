import json
from app.services.migration_plan_provider import migration_plan_provider

def enrich_components_with_csv(components_json_string: str) -> dict:
    """
    Parses a JSON string containing a list of components, enriches it with data
    from a CSV file, and returns the enriched data as a Python dictionary.

    Args:
        components_json_string: A JSON string representing the output of the analysis task.
                                  Expected format: {"processors": [...], "controller_services": [...]}

    Returns:
        A dictionary with the enriched component data.
    """
    print("\n[Enrichment Tool] Iniciando enriquecimiento de componentes con datos del CSV...")
    try:
        data = json.loads(components_json_string)
    except json.JSONDecodeError:
        print("[Enrichment Tool ERROR] La entrada no es un JSON válido.")
        # Si la entrada no es JSON, la devolvemos tal cual para no romper el flujo.
        return {"error": "Invalid JSON input for enrichment", "original_data": components_json_string}

    enriched_count = 0
    # Se procesan tanto procesadores como servicios de controlador
    for component_type in ["processors", "controller_services"]:
        if component_type in data:
            for component in data[component_type]:
                # El "tipo" es la clase Java, que es nuestro campo de búsqueda
                component_class = component.get("type")
                if component_class:
                    direct_plan = migration_plan_provider.find_component(component_class)
                    if direct_plan:
                        # ¡Coincidencia encontrada! Añadimos el plan directo.
                        component["direct_migration_plan"] = {
                            "status": direct_plan.get("status"),
                            "migration_action": direct_plan.get("migration_action"),
                            "notes": direct_plan.get("notes"),
                            "source": "migration_plan.csv"
                        }
                        enriched_count += 1
    
    print(f"[Enrichment Tool] Enriquecimiento completado. {enriched_count} componentes tienen un plan de migración directo.")
    return data
