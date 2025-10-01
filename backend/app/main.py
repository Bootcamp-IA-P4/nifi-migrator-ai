from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze_routes as analyze
from app.routes import help_routes as help
from app.routes import validate_routes as validate
from app.core.config import settings

app = FastAPI(
    title="NiFi Migrator AI",
    description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
    version="0.1.0",
)

origins = settings.ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])
app.include_router(help.router, prefix="/api/v1", tags=["Help"])
app.include_router(validate.router, prefix="/api/v1", tags=["Validate"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a NiFi Migrator AI 🚀"}
