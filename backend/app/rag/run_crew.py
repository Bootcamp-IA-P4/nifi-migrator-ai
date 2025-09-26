# Archivo de ejecución principal (ej: run_crew.py)

from app.agents.migration_crew import MigrationCrew
from app.agents.nifi_migration_tasks import NifiMigrationTasks

# Contenido de un template XML de NiFi 1.x (ficticio o real para la prueba)
template_de_prueba = "<template version='1.28'>...</template>" 
# Si el template es muy largo, puedes usar un string más realista para pruebas:
# template_de_prueba = "<flow><process-groups><id>pg1</id><name>Dataflow</name><processors><id>proc1</id><name>GetFile</name><type>org.apache.nifi.processors.standard.GetFile</type></processors></process-groups></flow>"


# Corregir la instanciación pasando el argumento 'xml_data'
crew_instance = MigrationCrew(xml_data=template_de_prueba) 

# El método .run() probablemente ya no necesite el argumento 'nifi_template_content' 
# porque ya se lo pasaste al constructor. Revisa la definición de .run().
resultado = crew_instance.run() # Lo más probable es que ahora se llame sin argumentos

print(resultado)