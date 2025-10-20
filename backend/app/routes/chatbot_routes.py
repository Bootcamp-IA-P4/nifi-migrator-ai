from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import chatbot_service
from app.models.report import ChatQuery, ChatResponse

router = APIRouter()

@router.post("/chatbot", response_model=ChatResponse, summary="Endpoint chatbot")
async def handle_chat(query: ChatQuery):
    try:
        answer = await chatbot_service.get_rag_answer(query.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar la pregutna.")