from crewai import Crew, Process
from .nifi_migration_agents import NifiMigrationAgents
from .nifi_migration_tasks import NifiMigrationTasks

# Este archivo es el que orquesta todo el proceso de migración usando CrewAI, llama al archivo de agentes, asigna el trabajo con tasks
# Crea el Crew y le dice que el proceso es secuencial, es decir que un agente no puede empezar hasta que el anterior haya terminado, y 
# finalmente arranca el proceso con kickoff()

class MigrationCrew:
    def __init__(self, xml_data: str):
        self.xml_data = xml_data

    def run(self):
        # Llamamos a los agentes y las tareas
        agents = NifiMigrationAgents()
        tasks = NifiMigrationTasks()

        # Definimos los agentes
        analyzer_agent = agents.nifi_xml_analyzer()
        mapper_agent = agents.migration_mapper()
        reporter_agent = agents.report_generator()

        # Definimos las tareas y las encadenamos
        analysis = tasks.analysis_task(analyzer_agent, self.xml_data)
        mapping = tasks.mapping_task(mapper_agent, analysis)
        reporting = tasks.reporting_task(reporter_agent, mapping)

        # Formar el Crew con un proceso secuencial
        crew = Crew(
            agents=[analyzer_agent, mapper_agent, reporter_agent],
            tasks=[analysis, mapping, reporting],
            process=Process.sequential,
            verbose=True,
        )

        # Ejecutamos el Crew, es decir, arrancamos el proceso
        result = crew.kickoff()
        return result