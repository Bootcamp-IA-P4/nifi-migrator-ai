## Configuración general (settings/env)
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "NiFi Migrator AI"
    VERSION: str = "0.1.0"
    DEBUG: bool = True
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

settings = Settings()
