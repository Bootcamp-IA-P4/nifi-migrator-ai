from .config import settings
from langchain_litellm import ChatLiteLLM

# En este archivo definimos la configuración del LLM que usaremos en los agentes

# llm_validator = ChatOpenAI(
#     api_key=settings.OPENROUTER_API_KEY,
#     model="openrouter/meta-llama/llama-3.1-70b-instruct",
#     base_url="https://openrouter.ai/api/v1",
#     model_kwargs={"extra_headers": {"HTTP-Referer": "nifi-migrator-ai"}}
# )


llm = ChatLiteLLM(
    model="openrouter/mistralai/mistral-7b-instruct:free",   # este es el de pago, solo se cambiaría , pero usar solamente cuando sea necesario: "anthropic/claude-sonnet-4-20250514"
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


llm_chatbot = ChatGroq(
    temperature=0,
    api_key=settings.GROQ_API_KEY,
)