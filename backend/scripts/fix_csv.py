import csv
import os

# Rutas a los ficheros CSV
SOURCE_PATH = os.path.join('backend', 'data', 'migration_plan.csv')
FIXED_PATH = os.path.join('backend', 'data', 'migration_plan_fixed.csv')
EXPECTED_COLUMNS = 7

def fix_and_harden_csv():
    print(f"--- Iniciando corrección y blindaje de {SOURCE_PATH} ---")
    
    # Construir la ruta absoluta al CSV desde la ubicación del script
    script_dir = os.path.dirname(__file__)
    absolute_source_path = os.path.abspath(os.path.join(script_dir, '..', '..', SOURCE_PATH))
    absolute_fixed_path = os.path.abspath(os.path.join(script_dir, '..', '..', FIXED_PATH))

    if not os.path.exists(absolute_source_path):
        print(f"[ERROR] El fichero original no existe en la ruta: {absolute_source_path}")
        return

    lines_fixed = 0
    total_lines_processed = 0
    problematic_lines_with_too_many_cols = []

    try:
        with open(absolute_source_path, 'r', encoding='utf-8') as infile:
            with open(absolute_fixed_path, 'w', encoding='utf-8', newline='') as outfile:
                
                reader = csv.reader(infile)
                writer = csv.writer(outfile, quoting=csv.QUOTE_ALL) # Blindar: citar todos los campos

                # Procesar cabecera
                header = next(reader)
                writer.writerow(header)
                total_lines_processed += 1
                
                for i, row in enumerate(reader, start=2): # Empezamos a contar desde la línea 2
                    total_lines_processed += 1
                    current_row = list(row) # Crear una copia modificable

                    if len(current_row) < EXPECTED_COLUMNS:
                        # Caso: Faltan columnas (el patrón más común)
                        lines_fixed += 1
                        current_row.extend(['N/A'] * (EXPECTED_COLUMNS - len(current_row)))
                        writer.writerow(current_row)
                    elif len(current_row) > EXPECTED_COLUMNS:
                        # Caso: Sobran columnas (los errores que arreglamos manualmente)
                        # La idea es que estos ya deberían estar arreglados. Si no, los truncamos.
                        problematic_lines_with_too_many_cols.append({
                            "line_number": i,
                            "found": len(current_row),
                            "content": current_row
                        })
                        # Truncamos la fila para que tenga el número correcto de columnas
                        writer.writerow(current_row[:EXPECTED_COLUMNS])
                    else:
                        # La línea tiene el número correcto de columnas
                        writer.writerow(current_row)

        print(f"\nProceso completado.")
        print(f"Se han procesado {total_lines_processed} líneas.")
        print(f"Se han corregido automáticamente {lines_fixed} líneas (añadiendo columnas faltantes con 'N/A').")
        print(f"El fichero corregido y blindado se ha guardado en: {absolute_fixed_path}")

        if problematic_lines_with_too_many_cols:
            print("\n[ADVERTENCIA] Se encontraron líneas con MÁS columnas de las esperadas. Estas líneas han sido truncadas.")
            for error in problematic_lines_with_too_many_cols:
                print(f"  Línea {error['line_number']}: Se encontraron {error['found']} columnas. Contenido: {error['content']}")
            print("Por favor, revisa estas líneas manualmente en el fichero original si el truncamiento no es deseado.")

        print("\nPor favor, revisa `migration_plan_fixed.csv` y si estás de acuerdo, lo usaremos para reemplazar el original.")

    except Exception as e:
        print(f"\n[ERROR] Ocurrió una excepción inesperada: {e}")

if __name__ == "__main__":
    fix_and_harden_csv()
