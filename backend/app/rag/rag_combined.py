"""
🔹 rag_combined.py
Este módulo combina dos fuentes de conocimiento para el RAG de NiFi Migrator AI:
1. Embeddings locales o existentes (vectores del conocimiento previo de NiFi 1.x y 2.x)
2. PDFs oficiales descargados automáticamente desde Supabase (bucket 'flow')

El objetivo es enriquecer las respuestas de los agentes con información técnica verificada.
"""

import os
import tempfile
from app.rag.query import get_context_for_agents  # Tu RAG original basado en embeddings locales
from app.services.supabase_registry import supabase  # Cliente Supabase ya configurado
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS


# ==========================================================
# 🧠 Función: Descargar PDFs desde Supabase
# ==========================================================
def download_pdfs_from_supabase(bucket: str = "flow"):
    """Descarga todos los archivos PDF del bucket especificado."""
    print(f"📥 Listando PDFs en bucket '{bucket}'...")

    try:
        files = supabase.storage.from_(bucket).list()
        pdf_files = [f["name"] for f in files if f["name"].endswith(".pdf")]
    except Exception as e:
        print(f"❌ Error listando archivos de Supabase: {e}")
        return []

    print(f"📂 Archivos detectados: {pdf_files}")
    local_files = []

    for filename in pdf_files:
        try:
            response = supabase.storage.from_(bucket).download(filename)
            if not response:
                print(f"⚠️ No se pudo descargar {filename}")
                continue

            local_path = os.path.join(tempfile.gettempdir(), filename)
            with open(local_path, "wb") as f:
                f.write(response)
            local_files.append(local_path)
            print(f"✅ Descargado: {local_path}")
        except Exception as e:
            print(f"❌ Error descargando {filename}: {e}")

    return local_files


# ==========================================================
# 🧠 Función: Construir el contexto desde PDFs de Supabase
# ==========================================================
def build_pdf_rag_context(bucket: str = "flow", k: int = 3):
    """Crea un contexto textual a partir de los PDFs descargados de Supabase."""
    local_pdfs = download_pdfs_from_supabase(bucket)
    if not local_pdfs:
        return "⚠️ No se encontraron PDFs en Supabase para generar contexto."

    texts = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)

    for pdf_path in local_pdfs:
        try:
            loader = PyPDFLoader(pdf_path)
            docs = loader.load()
            for doc in docs:
                chunks = splitter.split_text(doc.page_content)
                texts.extend(chunks)
        except Exception as e:
            print(f"❌ Error procesando {pdf_path}: {e}")

    if not texts:
        return "⚠️ No se pudo extraer texto de los PDFs."

    # Crear un FAISS temporal con embeddings de los documentos PDF
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts, embedding=embeddings)

    # Recuperar los k documentos más relevantes como contexto
    query = "Migración de Apache NiFi 1.x a 2.x, patrones y anti-patrones"
    results = vectorstore.similarity_search(query, k=k)

    context_text = "\n\n".join([r.page_content for r in results])
    return f"📚 Contexto extraído de PDFs oficiales:\n{context_text}"


# ==========================================================
# 🧠 Función principal combinada
# ==========================================================
def get_combined_context(query: str, k: int = 5) -> str:
    """
    Combina los contextos de:
      - Embeddings locales (RAG anterior)
      - PDFs oficiales descargados de Supabase
    """
    print("⚙️ Generando contexto combinado RAG...")

    try:
        local_context = get_context_for_agents(query, k)
    except Exception as e:
        local_context = f"⚠️ No se pudo obtener contexto local: {e}"

    try:
        pdf_context = build_pdf_rag_context(bucket="flow", k=3)
    except Exception as e:
        pdf_context = f"⚠️ No se pudo generar contexto desde PDFs: {e}"

    combined = (
        f"### 📘 Contexto de Embeddings Locales:\n{local_context}\n\n"
        f"### 📗 Contexto de Documentación Oficial (PDFs Supabase):\n{pdf_context}"
    )

    return combined
