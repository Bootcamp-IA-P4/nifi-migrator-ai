from fastapi import FastAPI
from routes import analyze_routes as analyze

app = FastAPI(
    title="NiFi Migrator AI",
    description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
    version="0.1.0"
)

app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a NiFi Migrator AI"}

from fastapi import FastAPI
from services.nifi_parser import parse_template, parse_directory, export_to_csv
import os

app = FastAPI()

TEMPLATES_DIR = "data/templates"
CSV_PATH = "data/comparative.csv"


@app.get("/analyze/{filename}")
def analyze_template(filename: str):
    path = os.path.join(TEMPLATES_DIR, filename)
    if not os.path.exists(path):
        return {"error": "Template no encontrado"}
    return parse_template(path)


@app.get("/analyze_all")
def analyze_all():
    parsed = parse_directory(TEMPLATES_DIR)
    export_to_csv(parsed, CSV_PATH)
    return {"status": "ok", "templates": [tpl["template"] for tpl in parsed]}


from fastapi import FastAPI
from routes import analyze_routes

app = FastAPI()

# Incluir las rutas de análisis
app.include_router(analyze_routes.router)
