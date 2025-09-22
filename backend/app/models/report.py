from pydantic import BaseModel
from typing import List, Optional

class ComponentReport(BaseModel):
    componente_nifi_1: str
    equivalente_nifi_2: str
    notas: str

class StructuredReport(BaseModel):
    resumen_ejecutivo: str
    analisis_componentes: List[ComponentReport]
    puntos_criticos: List[str]
    recomendaciones: List[str]

class Report(BaseModel):
    report: Optional[StructuredReport] = None
    error: Optional[str] = None

