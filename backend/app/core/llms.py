from .config import settings
from langchain_groq import ChatGroq

# En este archivo definimos la configuración del LLM que usaremos en los agentes

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="groq/meta-llama/llama-4-scout-17b-16e-instruct"
)