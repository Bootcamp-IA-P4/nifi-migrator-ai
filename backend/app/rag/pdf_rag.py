import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
# -- CAMBIO 1: Reemplazar OpenAI por Groq y HuggingFaceEmbeddings --
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
# ------------------------------------------------------------------
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter # Necesario para dividir el texto
from app.services.supabase_registry import supabase # Asume que tu cliente Supabase está inicializado aquí

# 1. Configuración y Directorios Temporales
# Carpeta temporal local para almacenar PDFs descargados
LOCAL_DATA_DIR = Path("data/pdfs")
LOCAL_DATA_DIR.mkdir(parents=True, exist_ok=True)
PDF_DOWNLOAD_DIR = "data"


# 2. Funciones de Listado y Descarga
def list_pdfs_recursive(bucket: str, path: str = "") -> list[str]:
    """Lista todos los PDFs en el bucket (recursivo)"""
    print(f"Buscando en ruta: {path}")
    
    # Intenta listar, maneja el caso de error si la ruta no existe o es inaccesible
    try:
        entries = supabase.storage.from_(bucket).list(path, {"limit": 100})
    except Exception as e:
        print(f"Error al listar '{path}' en Supabase: {e}")
        return []

    pdfs = []

    for e in entries:
        name = e.get("name", "")
        if not name or name == ".emptyFolderPlaceholder":
            continue

        full_path = os.path.join(path, name) if path else name

        if e.get("id") is not None:
            # Es un archivo
            if name.lower().endswith(".pdf"):
                pdfs.append(full_path)
        
        # Si no tiene 'id' y no tiene '.', asumimos que es una carpeta
        elif "." not in name:
            pdfs.extend(list_pdfs_recursive(bucket, full_path))

    return pdfs


def build_pdf_rag(pdf_paths: list[str]):
    """
    Carga los PDFs, crea chunks, genera embeddings, construye el vector store FAISS
    y retorna la cadena de RetrievalQA.
    """
    if not pdf_paths:
         raise ValueError("No se proporcionaron rutas de PDF para construir el RAG.")

    print(f"📚 Procesando {len(pdf_paths)} archivos...")
    
    # 1. Cargar documentos
    all_documents = []
    for path in pdf_paths:
        try:
            loader = PyPDFLoader(path)
            all_documents.extend(loader.load())
        except Exception as e:
            print(f"⚠️ Error al cargar {path}: {e}")
            
    if not all_documents:
        raise Exception("No se pudo cargar contenido de ninguno de los PDFs.")

    # 2. Dividir en chunks
    print(f"📑 Documentos cargados. Total de páginas/elementos: {len(all_documents)}. Dividiendo en chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(all_documents)
    
    # 3. y 4. Crear Embeddings y Vector Store (FAISS)
    print(f"🧩 Creando {len(docs)} chunks. Generando embeddings y FAISS...")
    
    # -- CAMBIO 2: Usar HuggingFaceEmbeddings (modelo local) --
    # Esto evita la necesidad de la clave de OpenAI
    # Nota: Este modelo se descarga automáticamente la primera vez.
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    # --------------------------------------------------------
    
    vectorstore = FAISS.from_documents(docs, embeddings)

    # 5. Configurar la cadena de QA
    # -- CAMBIO 3: Usar ChatGroq para el LLM --
    # Usa el modelo de Groq (Llama3) ya que tienes la clave GROQ_API_KEY en tu .env
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
    # -----------------------------------------

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    
    print("✅ RAG inicializado con éxito.")
    return qa_chain


# 3. Función Principal de Integración
def build_pdf_rag_from_supabase(bucket: str = "flow"):
    print(f"📥 Buscando PDFs en bucket '{bucket}'...")

    # 1. Listar todos los archivos PDF, incluyendo subcarpetas
    all_pdfs = list_pdfs_recursive(bucket)
    print("📂 Archivos detectados (rutas relativas en bucket):", all_pdfs)

    if not all_pdfs:
        # Aquí es donde fallaste antes. Si corriges el .env, esta excepción debería desaparecer.
        raise Exception(f"No se encontraron PDFs en el bucket '{bucket}'. Verifica las claves de Supabase y los permisos de Storage.")

    # 2. Descargamos cada PDF a una carpeta temporal local
    local_files = []
    os.makedirs(PDF_DOWNLOAD_DIR, exist_ok=True)
    
    print("⬇️ Iniciando descarga de archivos...")
    for pdf_key in all_pdfs:
        # Definimos la ruta local con solo el nombre del archivo para evitar problemas de subcarpetas locales
        local_path = os.path.join(PDF_DOWNLOAD_DIR, os.path.basename(pdf_key))
        
        try:
            # Usamos la ruta completa (pdf_key) para descargar
            res = supabase.storage.from_(bucket).download(pdf_key)
            with open(local_path, "wb") as f:
                f.write(res)
            local_files.append(local_path)
            print(f"Descargado: {pdf_key} a {local_path}")
        except Exception as e:
            print(f"❌ Falló la descarga de {pdf_key}. Error: {e}")

    # 3. Construir el RAG con los archivos locales descargados
    return build_pdf_rag(local_files)
