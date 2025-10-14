from app.rag.query import rag_search
from app.core.llms import llm_chatbot
from langchain_core.prompts import ChatPromptTemplate

PROMPT_TEMPLATE = """
Tu tarea es responder la pregunta del usuario basándote únicamente en el contexto proporcionado.
Tu audiencia no es técnica, así que usa un lenguaje muy simple y analogías.

**REGLAS IMPORTANTES:**
1.  **IDIOMA:** Responde siempre en el mismo idioma que la "Pregunta del usuario".
2.  **DIRECTO AL GRANO:** No saludes al usuario. No te presentes. No digas "hola" ni "aquí tienes la respuesta". Simplemente da la respuesta a su pregunta.
3.  **BREVEDAD:** Sé muy breve y conciso.

---
Your task is to answer the user's question based only on the provided context.
Your audience is non-technical, so use very simple language and analogies.

**IMPORTANT RULES:**
1.  **LANGUAGE:** Always respond in the same language as the "User's question".
2.  **BE DIRECT:** Do not greet the user. Do not introduce yourself. Do not say "hello" or "here is the answer". Just provide the answer to their question.
3.  **BREVITY:** Be very brief and concise.
---
Contexto / Context:
{context}

Pregunta del usuario / User's question:
{question}

Respuesta / Answer:
"""

async def get_rag_answer(question: str) -> str:
    print(f"[Chatbot Service] Recibida pregunta: {question}")
    try:
        relevant_docs = rag_search(question)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        print(f"[Chatbot Service] Contexto encontrado: {context[:200]}...")
    except Exception as e:
        print(f"[Chatbot Service ERROR] No se pudo consultar el índice RAG: {e}")
        return "Lo siento, tuve un problema al buscar en mi base de conocimiento."

    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    chain = prompt | llm_chatbot
    
    print("[Chatbot Service] Enviando prompt aumentado al LLM...")
    response = await chain.ainvoke({"context": context, "question": question})
    
    return response.content