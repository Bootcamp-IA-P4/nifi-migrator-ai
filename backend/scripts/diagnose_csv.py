import csv
import os
import sys

def diagnose_csv_file(csv_path):
    """
    Lee un fichero CSV línea por línea e informa de las líneas
    donde la columna 'source_doc' es 'N/A'.
    """
    print(f"--- Iniciando diagnóstico de {csv_path} para 'source_doc' con 'N/A' ---")
    
    if not os.path.exists(csv_path):
        print(f"[ERROR] El fichero no existe en la ruta: {csv_path}")
        return

    nifi1_components_to_document = []
    generic_url_components = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            
            # Leer la cabecera para encontrar los índices de las columnas
            try:
                header = next(reader)
                try:
                    nifi1_component_idx = header.index('nifi1_component')
                    source_doc_idx = header.index('source_doc')
                except ValueError:
                    print("[ERROR CRÍTICO] Las columnas 'nifi1_component' o 'source_doc' no se encontraron en la cabecera.")
                    print(f"Cabecera: {header}")
                    return
                print(f"Cabecera correcta. Buscando 'N/A' en 'source_doc'...")
            except StopIteration:
                print("[ERROR CRÍTICO] El fichero CSV está vacío.")
                return

            # Iterar sobre el resto de las líneas y recolectar los componentes
            for i, row in enumerate(reader, start=2): # Empezamos a contar desde la línea 2
                source_doc_value = row[source_doc_idx].strip() if len(row) > source_doc_idx else ""
                if source_doc_value.upper() == 'N/A':
                    nifi1_components_to_document.append(row[nifi1_component_idx])
                elif "nifi.apache.org" in source_doc_value and "1.28.0" not in source_doc_value:
                    generic_url_components.append(row[nifi1_component_idx])
            
    except Exception as e:
        print(f"[ERROR] Ocurrió una excepción inesperada al leer el fichero: {e}")
        return

    # Informar de los resultados
    if not nifi1_components_to_document:
        print("\n¡ÉXITO! No se encontraron componentes con 'source_doc' como 'N/A'.")
    else:
        print(f"\n--- Se encontraron {len(nifi1_components_to_document)} componentes con 'source_doc' como 'N/A' ---")
        for component in nifi1_components_to_document:
            print(f"- {component}")

    if generic_url_components:
        print(f"\n--- Se encontraron {len(generic_url_components)} componentes con URL genérica de NiFi ---")
        for component in generic_url_components:
            print(f"- {component}")
    
    print("\n--- Diagnóstico finalizado ---")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python diagnose_csv.py <ruta_al_fichero_csv>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    diagnose_csv_file(csv_file_path)
