from .config import settings
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
# En este archivo definimos la configuración del LLM que usaremos en los agentes

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="groq/meta-llama/llama-4-scout-17b-16e-instruct"
)

llm_validator = ChatOpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    model="openrouter/meta-llama/llama-3.1-70b-instruct",
    base_url="https://openrouter.ai/api/v1",
    model_kwargs={"extra_headers": {"HTTP-Referer": "nifi-migrator-ai"}}
)