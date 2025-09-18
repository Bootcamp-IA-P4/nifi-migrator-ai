from crewai import Agent
from app.core.llms import llm

# Esta es una estructura simple de agentes para la migración de NiFi, me imagino que lo iremos cambiando según vayamos probando

class NifiMigrationAgents:
    #este agente va a analizar el xml e identificar los componentes clave
    def nifi_xml_analyzer(self) -> Agent:
        return Agent(
            role="Analista experto en Arquitecturas NiFi 1.x",
            goal="Analizar meticulosamente la estructura de componentes de NiFi 1.x extraída de un template XML. Tu objetivo es identificar y listar todos los procesadores y servicios controladores.",
            backstory=(
                "Eres un ingeniero de datos senior con una década de experiencia construyendo flujos complejos en Apache NiFi 1.x. "
                "Tu especialidad es la auditoría de arquitecturas existentes para identificar componentes clave. Eres preciso, técnico y metódico."
            ),
            verbose=True,
            llm=llm,
        )

    def migration_mapper(self) -> Agent:
        #este agente va a tomar la lista del analista , va a mapear los componentes a nifi 2 y va a decir qué ha cambiado o está obsoleto
        return Agent(
            role="Especialista en Migración de NiFi 1.x a 2.x",
            goal="Mapear cada componente de NiFi 1.x a su equivalente en NiFi 2.x, identificando cambios requeridos, posibles incompatibilidades y componentes obsoletos.",
            backstory=(
                "Eres un consultor experto que ha liderado múltiples proyectos de migración de NiFi. Conoces a fondo las diferencias "
                "entre las versiones y tu objetivo es proporcionar una guía de mapeo clara y accionable. No solo identificas problemas, sino que sugieres soluciones."
            ),
            verbose=True,
            llm=llm,
        )

    def report_generator(self) -> Agent:
        #este agente va a tomar el análisis y lo va a convertir en un informe en markdown.
        return Agent(
            role="Redactor Técnico de Informes de Migración",
            goal="Generar un informe de migración completo y fácil de leer en formato Markdown, basado en el análisis técnico del especialista en migración.",
            backstory=(
                "Eres un escritor técnico que se especializa en crear documentación clara para proyectos de ingeniería complejos. "
                "Tu habilidad es tomar información técnica densa y presentarla de una manera estructurada y comprensible para los desarrolladores que ejecutarán la migración."
            ),
            verbose=True,
            llm=llm,
        )