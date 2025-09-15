from fastapi import FastAPI
from app.routes import analyze_routes as analyze

app = FastAPI(
    title="NiFi Migrator AI",
    description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
    version="0.1.0"
)

app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a NiFi Migrator AI"}
