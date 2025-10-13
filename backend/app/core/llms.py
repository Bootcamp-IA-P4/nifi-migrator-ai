from .config import settings
from langchain_litellm import ChatLiteLLM

# En este archivo definimos la configuración del LLM que usaremos en los agentes

# llm_validator = ChatOpenAI(
#     api_key=settings.OPENROUTER_API_KEY,
#     model="openrouter/meta-llama/llama-3.1-70b-instruct",
#     base_url="https://openrouter.ai/api/v1",
#     model_kwargs={"extra_headers": {"HTTP-Referer": "nifi-migrator-ai"}}
# )


# llm = ChatLiteLLM(
#     model="openrouter/deepseek/deepseek-chat",
#     temperature=0.1,
#     max_tokens=8192,
# )

llm_chatbot = ChatLiteLLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0,
    api_key=settings.GROQ_API_KEY,
)