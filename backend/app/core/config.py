## Configuración general (settings/env)
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "NiFi Migrator AI"
    VERSION: str = "0.1.0"
    DEBUG: bool = True
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "") 
    # --- CONFIGURACIÓN DE SUPABASE ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Bucket para los documentos del rag
    SUPABASE_BUCKET: str = os.getenv("SUPABASE_BUCKET", "nifi-docs")
    
    # Bucket para los XML originales subidos por el usuario
    SUPABASE_BUCKET1: str = os.getenv("SUPABASE_BUCKET1", "history")
    
    # Bucket para los informes .md generados para auditoría
    SUPABASE_BUCKET_REPORTS: str = os.getenv("SUPABASE_BUCKET_REPORTS", "reports")

    # Bucket flow para los PDFs de documentación técnica
    SUPABASE_BUCKET_FLOW: str = os.getenv("SUPABASE_BUCKET_FLOW", "flow")
    
    # --- OTRAS CONFIGURACIONES ---
    # Dataset para validación del auditor
    DATASET_PATH: str = os.getenv("DATASET_PATH", "backend/data/migration_plan.csv")
    # Origins para CORS
    ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
    REPORTS_DIR: str = "data/reports"


settings = Settings()
