from nifi_parser import parse_directory, export_to_csv
import os

# BASE_DIR = carpeta raíz del proyecto (nifi-migrator-ai)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

TEMPLATES_DIR = os.path.join(BASE_DIR, "nifi-flows", "nifi-templates")
CSV_OUT = os.path.join(BASE_DIR, "data", "comparative.csv")

if __name__ == "__main__":
    parsed = parse_directory(TEMPLATES_DIR)
    export_to_csv(parsed, CSV_OUT)
    print(f"[OK] Analizados {len(parsed)} templates")
    for tpl in parsed:
        print(f" - {tpl['template']} → {len(tpl['processors'])} procesadores")
    print(f"CSV generado en: {CSV_OUT}")
