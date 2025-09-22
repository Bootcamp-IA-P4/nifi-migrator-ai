import xml.etree.ElementTree as ET
from typing import Dict, Any, List
import os
import pandas as pd
from tabulate import tabulate
import argparse

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
        "processors": [parse_processor(p) for p in root.findall(".//processors/processor")],
        "controllerServices": [parse_controller_service(cs) for cs in root.findall(".//controllerServices/service")],
    }

def parse_directory(dir_path: str) -> List[Dict[str, Any]]:
    """Parsea todos los templates en un directorio."""
    results = []
    xml_files = [f for f in os.listdir(dir_path) if f.lower().endswith('.xml')]
    
    if not xml_files:
        print(f"No se encontraron archivos XML en: {dir_path}")
        return results
    
    for fname in xml_files:
        try:
            full_path = os.path.join(dir_path, fname)
            results.append(parse_template(full_path))
            print(f"[OK] Parseado: {fname}")
        except Exception as e:
            print(f"[ERROR] en {fname}: {e}")
    return results

def display_in_terminal(parsed_templates: List[Dict[str, Any]]):
    """Muestra la información de los templates en la terminal."""
    
    if not parsed_templates:
        print("No se encontraron templates para mostrar.")
        return
    
    print("\n" + "="*80)
    print("INFORMACIÓN DE TEMPLATES NIFI")
    print("="*80)
    
    for i, tpl in enumerate(parsed_templates, 1):
        print(f"\n📋 TEMPLATE {i}: {tpl['template']}")
        print(f"   Descripción: {tpl['description'] or 'Sin descripción'}")
        print(f"   Procesadores: {len(tpl['processors'])}")
        print(f"   Controller Services: {len(tpl['controllerServices'])}")
    
    if any(tpl['processors'] for tpl in parsed_templates):
        print("\n" + "-"*80)
        print("TABLA DE PROCESADORES")
        print("-"*80)
        
        processor_rows = []
        for tpl in parsed_templates:
            for proc in tpl["processors"]:
                processor_rows.append([
                    tpl["template"],
                    proc["name"],
                    proc["type"],
                    proc["id"]
                ])
        
        print(tabulate(processor_rows, 
                      headers=["Template", "Processor", "Type", "ID"],
                      tablefmt="grid"))

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

def find_xml_files():
    """Busca archivos XML en el proyecto."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))  # backend directory
    
    xml_files = []
    for root, dirs, files in os.walk(project_root):
        for file in files:
            if file.lower().endswith('.xml'):
                full_path = os.path.join(root, file)
                xml_files.append(full_path)
    
    return xml_files

def run_simple():
    """Versión simplificada sin argumentos complejos."""
    print("🔍 Buscando archivos XML en el proyecto...")
    xml_files = find_xml_files()
    
    if not xml_files:
        print("❌ No se encontraron archivos XML en el proyecto.")
        return
    
    print(f"📄 Encontrados {len(xml_files)} archivos XML:")
    for i, file_path in enumerate(xml_files, 1):
        print(f"   {i}. {file_path}")
    
    # Parsear todos los archivos encontrados
    parsed_templates = []
    for file_path in xml_files:
        try:
            template = parse_template(file_path)
            parsed_templates.append(template)
        except Exception as e:
            print(f"[ERROR] en {os.path.basename(file_path)}: {e}")
    
    if parsed_templates:
        display_in_terminal(parsed_templates)
        
        # Preguntar si exportar a CSV
        export = input("\n¿Exportar a CSV? (s/n): ").lower().strip()
        if export == 's':
            script_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(script_dir, "nifi_templates.csv")
            export_to_csv(parsed_templates, csv_path)
    else:
        print("❌ No se pudieron parsear los templates.")

if __name__ == "__main__":
    run_simple()