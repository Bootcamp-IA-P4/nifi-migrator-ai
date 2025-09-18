from crewai import Task
from textwrap import dedent

# Este archivo es el lugar donde definimos tareas para nuestros agentes.
# Cada tarea está metida aquí pero se pueden pasar a un archivo separado de prompst y llamarse desde aquí.

class NifiMigrationTasks:
    def analysis_task(self, agent, parsed_xml_data: str) -> Task:
        #esta es la instrucción para el agente que analiza el xml.
        return Task(
            description=dedent(f"""Analiza la siguiente estructura de flujo de NiFi 1.x, extraída de un template XML.
                Tu misión es listar todos los componentes encontrados.

                Datos del Flujo a Analizar:
                ---
                {parsed_xml_data}
                ---

                Identifica cada procesador y servicio controlador por su nombre y, más importante, por su tipo (type).
                Proporciona un resumen claro y conciso de los componentes.
            """),
            expected_output="Una lista estructurada de procesadores y servicios controladores, detallando su nombre y tipo.",
            agent=agent,
        )

    def mapping_task(self, agent, context_task: Task) -> Task:
        # esta tarea es para el agente que mapea los componentes a nifi 2
        return Task(
            description=dedent("""Basado en el análisis de componentes de NiFi 1.x, tu tarea es mapear cada uno a su equivalente en NiFi 2.x.
                Debes explicar qué ha cambiado para cada componente.

                Para cada componente, determina:
                1. Si la migración es directa.
                2. Si el componente ha sido reemplazado o renombrado.
                3. Si es un componente obsoleto que requiere una estrategia completamente nueva.
            """),
            expected_output="Un informe técnico detallado que describa el plan de migración para cada componente.",
            agent=agent,
            context=[context_task],
        )

    def reporting_task(self, agent, context_task: Task) -> Task:
        # esta tarea es para el agente redactor.
        return Task(
            description=dedent("""
                Usando el análisis de mapeo técnico, genera un informe de migración completo en formato Markdown.
                El informe debe ser profesional, claro y dirigido a un equipo de desarrolladores.

                El informe DEBE incluir las siguientes secciones:
                - **Resumen Ejecutivo**
                - **Análisis de Componentes** (Tabla: Componente NiFi 1, Equivalente NiFi 2, Notas)
                - **Puntos Críticos y Advertencias**
                - **Recomendaciones**
            """),
            expected_output="Un informe final completo en formato Markdown, con todas las secciones requeridas.",
            agent=agent,
            context=[context_task],
        )
