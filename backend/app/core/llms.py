from .config import settings
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_litellm import ChatLiteLLM
import os

# 🧠 LLM principal (usando OpenRouter con modelo gratuito)
# Usaremos un modelo público accesible sin modificar la política:
# 'mistralai/mixtral-8x7b' o 'meta-llama/llama-3-8b-instruct'
try:
    llm_validator = ChatOpenAI(
        api_key=settings.OPENROUTER_API_KEY,
        model="mistralai/mixtral-8x7b",  # modelo gratuito disponible
        base_url="https://openrouter.ai/api/v1",
        model_kwargs={
            "extra_headers": {
                "HTTP-Referer": "https://nifi-migrator-ai.factoriaf5.com",
                "X-Title": "NiFi Migrator AI"
            }
        }
    )

    # 🔹 LLM principal para la ejecución de tareas (CrewAI)
    llm = ChatLiteLLM(
        model="mistralai/mixtral-8x7b",  # modelo accesible sin restricciones
        temperature=0.2,
        max_output_tokens=8192,
        litellm_params={
            "metadata": {
                "headers": {
                    "HTTP-Referer": "https://nifi-migrator-ai.factoriaf5.com",
                    "X-Title": "NiFi Migrator AI"
                }
            }
        }
    )

except Exception as e:
    print("⚠️ OpenRouter no disponible, usando fallback Groq.")
    llm_validator = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name="mixtral-8x7b"
    )
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name="mixtral-8x7b",
        temperature=0.2
    )
