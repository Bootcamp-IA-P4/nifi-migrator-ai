import sys
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    print("🚀 Iniciando PRUEBA DE MEMORIA...")

    # from app.routes import analyze_routes as analyze
    # from app.routes import help_routes as help
    # from app.routes import validate_routes as validate
    from app.core.config import settings
    from app.routes import storage_routes as storage
    # from app.routes import audit_routes
    from app.routes import chatbot_routes as chatbot

    print("✅ Módulos mínimos importados.")

    app = FastAPI(
        title="NiFi Migrator AI - Prueba de Memoria",
        description="Probando el arranque sin las rutas completas",
        version="0.1.0",
    )

    print(f"⚙️  Configurando CORS para los orígenes: {settings.ORIGINS}")
    origins = settings.ORIGINS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in origins if origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])
    # app.include_router(audit_routes.router, prefix="/api/v1", tags=["Audit"])
    app.include_router(chatbot.router, prefix="/api/v1", tags=["Chatbot"])
    app.include_router(storage.router, prefix="/api/v1", tags=["Storage"])

    print("✅ Routers NO incluidos.")

    @app.get("/")
    def read_root():
        return {"message": "¡Prueba de Memoria FUNCIONANDO! El problema está en la importación de las rutas."}

    print("🚀🚀 La aplicación base (sin rutas) está lista para iniciarse. 🚀🚀")

except Exception as e:
    print("==========================================================")
    print("‼️ ERROR FATAL INCLUSO EN LA PRUEBA DE MEMORIA ‼️")
    print(f"Error: {e}")
    print("--- Traceback ---")
    traceback.print_exc(file=sys.stdout)
    print("==========================================================")
    sys.exit(1)
