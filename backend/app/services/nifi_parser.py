import xml.etree.ElementTree as ET
from typing import Dict, Any, List
import os
import pandas as pd


def parse_processor(proc_elem) -> Dict[str, Any]:
    """Extrae información básica de un procesador."""
    return {
        "id": proc_elem.findtext("id"),
        "name": proc_elem.findtext("name"),
        "type": proc_elem.findtext("type"),
        "bundle": proc_elem.findtext("bundle/artifact"),
    }


def parse_controller_service(cs_elem) -> Dict[str, Any]:
    """Extrae información básica de un controller service."""
    return {
        "id": cs_elem.findtext("id"),
        "name": cs_elem.findtext("name"),
        "type": cs_elem.findtext("type"),
    }


def parse_template(path: str) -> Dict[str, Any]:
    """Parsea un template NiFi XML y devuelve un dict con procesadores y services."""
    tree = ET.parse(path)
    root = tree.getroot()
    return {
        "template": root.findtext("name"),
        "description": root.findtext("description"),
        "processors": [parse_processor(p) for p in root.findall(".//processors")],
        "controllerServices": [parse_controller_service(cs) for cs in root.findall(".//controllerServices")],
    }


def parse_directory(dir_path: str) -> List[Dict[str, Any]]:
    """Parsea todos los templates en un directorio."""
    results = []
    for fname in os.listdir(dir_path):
        if fname.lower().endswith(".xml"):
            try:
                results.append(parse_template(os.path.join(dir_path, fname)))
            except Exception as e:
                print(f"Error en {fname}: {e}")
    return results


def export_to_csv(parsed_templates: List[Dict[str, Any]], out_path: str):
    """Convierte la lista de templates parseados en CSV comparativo."""
    rows = []
    for tpl in parsed_templates:
        for proc in tpl["processors"]:
            rows.append(
                {
                    "template": tpl["template"],
                    "processor": proc["name"],
                    "type": proc["type"],
                }
            )
    df = pd.DataFrame(rows)
    df.to_csv(out_path, index=False)
    print(f"[INFO] CSV exportado a {out_path}")
