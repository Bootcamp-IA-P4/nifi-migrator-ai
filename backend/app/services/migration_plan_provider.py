import pandas as pd
import os

class MigrationPlanProvider:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MigrationPlanProvider, cls).__new__(cls)
        return cls._instance

    def __init__(self, csv_path='data/migration_plan_fixed.csv'):
        # Evita la reinicialización si la instancia ya existe
        if hasattr(self, '_initialized') and self._initialized:
            return
        
        # Construye la ruta absoluta al CSV desde la ubicación de este fichero
        # __file__ -> .../backend/app/services/migration_plan_provider.py
        # os.path.dirname(__file__) -> .../backend/app/services
        # os.path.join(..., '..', '..') -> .../backend
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        absolute_csv_path = os.path.join(base_dir, csv_path)

        if not os.path.exists(absolute_csv_path):
            self._data = {}
            print(f"ADVERTENCIA: No se encontró el archivo CSV en {absolute_csv_path}. El proveedor de plan de migración estará vacío.")
        else:
            df = pd.read_csv(absolute_csv_path, engine='python', sep=',')
            # Normalizar el nombre del componente para que sirva como clave fiable
            df['lookup_key'] = df['component_name'].str.lower().str.strip()
            self._data = df.set_index('lookup_key').to_dict(orient='index')
        
        self._initialized = True

    def find_component(self, component_name: str):
        """Busca un componente por su nombre en el plan de migración."""
        if not self._data:
            return None
        key = component_name.lower().strip()
        return self._data.get(key)

# Instancia Singleton que será importada por otros módulos
migration_plan_provider = MigrationPlanProvider()
