# NEXOPS AI Solutions

**Proyecto educativo.**

<div align="center">
  <img src="https://res.cloudinary.com/artevivo/image/upload/v1760915770/Captura_de_pantalla_2025-10-20_011329_sxyviv.png" alt="Banner centrado" width="900" height="450">
</div>
---

## 📑 Índice

1. [La Problemática](#la-problemática)
2. [Nuestra Solución](#nuestra-solución)
3. [Características Clave](#características-clave)
4. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
5. [Stack Tecnológico](#stack-tecnológico)
6. [Cómo Empezar](#cómo-empezar)
7. [El Equipo](#el-equipo)

---

## ❗ La Problemática

Apache NiFi 1.x ya no cuenta con soporte oficial, lo que presenta un desafío crítico para las empresas que dependen de esta versión para sus flujos de datos.

Migrar de NiFi 1.x a 2.x es un proceso complejo, manual y que consume mucho tiempo. Implica revisar manualmente cientos de procesadores, configuraciones y rutas, lo que a menudo conduce a errores, problemas de compatibilidad y una pérdida significativa de la trazabilidad. Este proceso puede llevar semanas, consumiendo valiosos recursos y paciencia.

---

## ✅ Nuestra Solución

**Nifi Migrator AI** transforma este proceso costoso y arriesgado en una experiencia eficiente, confiable y automatizada.

El usuario simplemente sube sus flujos de NiFi 1.x, y nuestro equipo de agentes de IA especializados realiza un análisis y migración completos en horas, no en semanas.

Nuestra solución se basa en una sofisticada arquitectura de agentes de IA:

- 🤖 **Equipo de Análisis con CrewAI:** Un equipo de 4 agentes expertos (Analizador, Mapeador, Conversor y Reportero) colabora para analizar el flujo, mapear los componentes y generar un informe técnico detallado.
- ✅ **Agente Auditor:** Actúa como un experto “escéptico” que realiza control de calidad del informe generado.
- 💬 **Agente Chatbot (RAG):** Permite consultas en lenguaje natural sobre NiFi, utilizando documentación oficial como base de conocimiento.

📍 **Resultado final:** Un informe técnico en PDF con diagramas visuales del “antes y después” del flujo migrado.

---

## 🚀 Características Clave

| Característica | Descripción |
|---------------|------------|
| 🤖 Automatización inteligente | Detecta y corrige inconsistencias |
| 📊 Trazabilidad completa | Documentación generada automáticamente |
| 💬 Chatbot con IA (RAG) | Consultas en lenguaje natural sobre NiFi |
| 📄 Informes técnicos en PDF | Incluye diagramas visuales |

---

## 🏗️ Diagrama de Arquitectura

<div align="center">
  <img src="https://res.cloudinary.com/artevivo/image/upload/v1760915769/Captura_de_pantalla_2025-10-16_202146_lwce4z.png" alt="Banner centrado" width="500" height="800">
</div>

Nuestra arquitectura está construida con un **frontend en React** conectado mediante APIs a un **backend en FastAPI**, el cual utiliza **CrewAI** para la orquestación de agentes y **Supabase** para almacenamiento y base de conocimiento (RAG).

---

## 🛠️ Stack Tecnológico

| Backend | Frontend | IA & Orquestación | Base de Datos / Nube | Herramientas |
|---------|----------|------------------|----------------------|--------------|
| Python 🐍 | React ⚛️ | CrewAI 🧠 | Supabase 🛢️ | Git / GitHub |
| FastAPI ⚡ | JavaScript 📜 | RAG 📚 | | VS Code 💻 |
| Node.js 🟢 | Tailwind CSS 🎨 | | | |

---

## ▶️ Cómo Empezar

### 📥 Clona el repositorio

```bash
git clone https://github.com/Bootcamp-IA-P4/nifi-migrator-ai.git
```

## 🐍 Backend

```bash
cd backend
```

### 1️⃣ Crea y activa un entorno virtual:

```bash
python -m venv .venv
source .venv/Scripts/activate # Windows
source .venv/bin/activate  # Linux/Mac
```
### 2️⃣ Instala las dependencias.

```bash
pip install -r requirements.txt
```
### 3️⃣ Ejecuta la aplicación

```bash
uvicorn server.main:app --reload
```

## ⚛️ Frontend

```bash
cd Frontend
```

### 1️⃣ Instala las dependencias::

```bash
npm i
```
### 2️⃣  Ejecuta la aplicación.

```bash
npm run dev
```

## 👥 El Equipo

- [Orlando: Backend Developer / Product Owner](https://github.com/odar1997/)  
- [Nhoeli: Backend Developer / Líder Técnico](https://github.com/Nho89/)   
- [Juan Domingo: IA Developer / Agentes](https://github.com/jdomdev/)   
- [Andreina: Frontend Developer / Scrum Master](https://github.com/mariasuescum/)
---

- ✨ Gracias por visitar nuestro proyecto. ¡Estamos construyendo el futuro de las migraciones NiFi con IA!
---

<p align="right">(<a href="#-index">⬆️ Back to top</a>)</p>
