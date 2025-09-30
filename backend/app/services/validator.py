from typing import List, Dict, Any
import csv

def load_mappings(dataset_path: str) -> Dict[str, str]:
    mappings: Dict[str, str] = {}
    with open(dataset_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            mappings[row["nifi1_component"]] = row["nifi2_equivalent"]
    return mappings

def validate_migration_report(components: List[Dict[str, Any]], dataset_path: str) -> Dict[str, Any]:
    mappings = load_mappings(dataset_path)
    total, aciertos = 0, 0
    errores = []

    for comp in components:
        nifi1 = comp.get("componente_nifi_1")
        nifi2 = comp.get("equivalente_nifi_2")
        if nifi1 in mappings:
            total += 1
            esperado = mappings[nifi1]
            if esperado == nifi2:
                aciertos += 1
            else:
                errores.append({
                    "componente": nifi1,
                    "esperado": esperado,
                    "obtenido": nifi2
                })

    precision = (aciertos / total * 100) if total > 0 else 0.0

    return {
        "precision": precision,
        "aciertos": aciertos,
        "total": total,
        "errores": errores
    }
