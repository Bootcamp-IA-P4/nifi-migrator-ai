import sys
from fastapi import FastAPI

print("🚀 INICIANDO PRUEBA DE HUMO - APP MÍNIMA 🚀")

try:
    app = FastAPI(title="Prueba de Humo")

    @app.get("/")
    def read_root():
        return {"message": "¡La prueba de humo ha funcionado! El entorno de Render está OK."}

    print("✅ La aplicación mínima se ha creado correctamente y está lista.")

except Exception as e:
    print(f"‼️ ERROR INESPERADO DURANTE LA PRUEBA DE HUMO: {e} ‼️")
    # Si incluso esto falla, el problema es muy profundo.
    sys.exit(1)
