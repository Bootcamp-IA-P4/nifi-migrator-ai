from .config import settings
from langchain_litellm import ChatLiteLLM

# En este archivo definimos la configuración del LLM que usaremos en los agentes

llm = ChatLiteLLM(
    # LiteLLM usará automáticamente la variable de entorno OPENROUTER_API_KEY
    model="openrouter/deepseek/deepseek-chat-v3.1:free",# it works(5:30s) and prints mermaid syntax correctly
    # model="openrouter/x-ai/grok-4-fast:free",# it works(4:30s) but does not follow prints mermaid syntax
    # model="openrouter/google/gemini-2.0-flash-exp:free",
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