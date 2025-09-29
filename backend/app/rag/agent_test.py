# Simulación en un entorno de pruebas o script
from app.rag.query import get_context_for_agents

# 1. Prueba con una consulta general de migración
print("--- PRUEBA 1: Consulta de Mapeo ---")
query_mapeo = "Mapeo de componentes y sus propiedades de NiFi 1.28 a NiFi 2.5.0"
contexto_mapeo = get_context_for_agents(query_mapeo, k=3) # Usar k=3 para una revisión rápida
print(contexto_mapeo)
# >> Espera ver: Bloques de texto con menciones a 'Processor', 'Controller Service',
#                '1.x' y '2.x', y el formato de cita como "[Cita: documento_X]".

print("\n--- PRUEBA 2: Consulta Específica ---")
query_especifica = "Propiedades del procesador UpdateAttribute en NiFi 2.5.0"
contexto_especifico = get_context_for_agents(query_especifica, k=2)
print(contexto_especifico)
# >> Espera ver: Información detallada de las propiedades del procesador
#                UpdateAttribute con citas de la documentación.