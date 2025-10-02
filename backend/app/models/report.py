from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ComponentReport(BaseModel):
    componente_nifi_1: str
    equivalente_nifi_2: str
    notas: str

class StructuredReport(BaseModel):
    resumen_ejecutivo: str
    analisis_componentes: List[ComponentReport]
    puntos_criticos: List[str]
    recomendaciones: List[str]
    validacion: Optional[Dict[str, Any]] = None

class Report(BaseModel):
    structured: Optional[Dict[str, Any]] = None
    raw_markdown: Optional[str] = None 
    error: Optional[str] = None

