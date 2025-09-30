from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import analyze_routes as analyze
from app.routes import help_routes as help
from app.routes import storage_routes as storage

# ---------------------------------------------------
# Configuración general de la API
# ---------------------------------------------------
app = FastAPI(
    title="NiFi Migrator AI",
    description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
    version="0.1.0",
)

# ---------------------------------------------------
# Configuración CORS
# ---------------------------------------------------
# Puedes definir los orígenes en tu archivo .env:
# ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE...
    allow_headers=["*"],  # Autorizaciones, JSON, etc.
)

# ---------------------------------------------------
# Rutas de la API
# ---------------------------------------------------
app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])
app.include_router(help.router, prefix="/api/v1", tags=["Help"])
app.include_router(storage.router, prefix="/api/v1", tags=["Storage"])

# ---------------------------------------------------
# Endpoint raíz
# ---------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "Bienvenido a NiFi Migrator AI 🚀"}
