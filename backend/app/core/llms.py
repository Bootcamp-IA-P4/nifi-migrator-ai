from .config import settings
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_litellm import ChatLiteLLM

def build_llms():
    try:
        # 🔹 Modelo gratuito de OpenRouter (DeepSeek)
        llm = ChatLiteLLM(
            model="openrouter/deepseek/deepseek-chat-v3.1:free",
            temperature=0.1,
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

        llm_validator = ChatOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            model="openrouter/mistralai/mixtral-8x7b",
            base_url="https://openrouter.ai/api/v1",
            model_kwargs={
                "extra_headers": {
                    "HTTP-Referer": "https://nifi-migrator-ai.factoriaf5.com",
                    "X-Title": "NiFi Migrator AI"
                }
            }
        )

        print("✅ OpenRouter cargado correctamente.")
        return llm, llm_validator

    except Exception as e:
        print("⚠️ OpenRouter no disponible, usando fallback Groq:", e)
        # 🔹 Fallback Groq
        llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name="mixtral-8x7b",
            temperature=0.1
        )
        llm_validator = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name="mixtral-8x7b"
        )
        return llm, llm_validator

# Exportar objetos globales
llm, llm_validator = build_llms()
