# Pydantic models (entrada/salida)
from pydantic import BaseModel
from typing import List

class Report(BaseModel):
    total_processors: int
    processors: List[str]
    incompatibilities: List[str]
