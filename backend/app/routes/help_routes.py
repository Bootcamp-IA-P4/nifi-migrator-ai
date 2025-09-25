# app/routes/help_routes.py
from fastapi import APIRouter
import socket

router = APIRouter()

@router.get("/help", tags=["Help"])
def get_help():
    """
    Endpoint de salud del backend.
    """
    return {
        "status": "ok",
        "service": "NiFi Migrator AI Backend",
        "message": "El backend está funcionando correctamente 🚀",
        "host": socket.gethostname()
    }
