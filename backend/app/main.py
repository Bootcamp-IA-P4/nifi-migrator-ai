import sys
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Mantenemos todo dentro de un bloque try/except para una depuración final.
try:
    print("🚀 Iniciando la aplicación completa...")

    # Importaciones de la aplicación
    from app.routes import analyze_routes as analyze
    from app.routes import help_routes as help
    from app.routes import validate_routes as validate
    from app.core.config import settings
    from app.routes import storage_routes as storage
    from app.routes import audit_routes
    from app.routes import chatbot_routes as chatbot

    print("✅ Módulos de la aplicación importados.")

    app = FastAPI(
        title="NiFi Migrator AI",
        description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
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

    # Inclusión de las rutas de la API
    app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])
    app.include_router(help.router, prefix="/api/v1", tags=["Help"])
    app.include_router(validate.router, prefix="/api/v1", tags=["Validate"])
    app.include_router(storage.router, prefix="/api/v1", tags=["Storage"])
    app.include_router(audit_routes.router, prefix="/api/v1", tags=["Audit"])
    app.include_router(chatbot.router, prefix="/api/v1", tags=["Chatbot"])

    print("✅ Routers incluidos.")

    @app.get("/")
    def read_root():
        return {"message": "Bienvenido a NiFi Migrator AI 🚀"}

    print("🚀🚀 La aplicación completa está lista para iniciarse. 🚀🚀")

except Exception as e:
    # Si algo falla durante la carga de las rutas o servicios, lo veremos aquí.
    print("==========================================================")
    print("‼️ ERROR FATAL DURANTE EL ARRANQUE DE LA APLICACIÓN COMPLETA ‼️")
    print(f"Error: {e}")
    print("--- Traceback ---")
    traceback.print_exc(file=sys.stdout)
    print("==========================================================")
    sys.exit(1)