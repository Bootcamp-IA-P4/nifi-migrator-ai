import sys
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import storage_routes, chatbot_routes
from app.core.config import settings

try:
    print("🚀 Iniciando la aplicación (Versión con CORS corregido)...")

    app = FastAPI(
        title="NiFi Migrator AI",
        description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
        version="0.1.0",
    )

    print("⚙️  Configurando CORS para permitir TODOS los orígenes...")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], 
        allow_credentials=True,
        allow_methods=["*"],  
        allow_headers=["*"], 
    )

    print("✅ CORS configurado.")

    # app.include_router(analyze_routes.router, prefix="/api/v1", tags=["Analyze"])
    # app.include_router(help_routes.router, prefix="/api/v1", tags=["Help"])
    # app.include_router(validate_routes.router, prefix="/api/v1", tags=["Validate"])
    app.include_router(storage_routes.router, prefix="/api/v1", tags=["Storage"])
    # app.include_router(audit_routes.router, prefix="/api/v1", tags=["Audit"])
    app.include_router(chatbot_routes.router, prefix="/api/v1", tags=["Chatbot"])

    print("✅ Todos los routers han sido incluidos.")

    @app.get("/")
    def read_root():
        return {"message": "Bienvenido a la API de NiFi Migrator AI 🚀"}

    print("🚀🚀 La aplicación completa está lista para iniciarse. 🚀🚀")

except Exception as e:
    print("==========================================================")
    print("‼️ ERROR FATAL DURANTE EL ARRANQUE ‼️")
    print(f"Error: {e}")
    print("--- Traceback ---")
    traceback.print_exc(file=sys.stdout)
    print("==========================================================")
    sys.exit(1)

