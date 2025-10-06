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
    #supabase :
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_BUCKET: str = os.getenv("SUPABASE_BUCKET", "nifi-docs")
    #dataset para validación
    DATASET_PATH: str = os.getenv("DATASET_PATH", "data/migration_plan.csv")
    # origins para CORS
    ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
    #supabase para subir los informes:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY") 
    # Bucket para los XML originales
    SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "nifi-docs")
    # Bucket para los informes de migración
    SUPABASE_BUCKET1 = os.getenv("SUPABASE_BUCKET1", "history")


settings = Settings()
