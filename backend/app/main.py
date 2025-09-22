from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← Agregar esta importación
from app.routes import analyze_routes as analyze

app = FastAPI(
    title="NiFi Migrator AI",
    description="API para analizar y migrar flujos NiFi 1.x → 2.x con IA",
    version="0.1.0"
)

# ✅ CONFIGURACIÓN CORS - ESTO ES LO QUE FALTABA
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React (create-react-app)
        "http://127.0.0.1:3000",     # React (create-react-app)
        "http://localhost:5173",      # Vite
        "http://127.0.0.1:5173",     # Vite
        "http://localhost:3001",      # Otros puertos comunes
        "http://127.0.0.1:3001",
        # Agrega aquí el puerto donde corre tu frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],              # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # Permite todos los headers
)

app.include_router(analyze.router, prefix="/api/v1", tags=["Analyze"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a NiFi Migrator AI"}

