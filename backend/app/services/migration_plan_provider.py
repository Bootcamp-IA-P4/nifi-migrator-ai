import os
from app.services.supabase_registry import supabase # Import the Supabase client
from app.core.config import settings # Import settings to get the table name

class MigrationPlanProvider:
    _instance = None
    _initialized = False # Add an initialization flag

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MigrationPlanProvider, cls).__new__(cls)
        return cls._instance

    def __init__(self): # Remove csv_path parameter
        if self._initialized:
            return

        print("[MigrationPlanProvider] Initializing with Supabase data...")
        self._data = {}
        try:
            # Fetch data from Supabase
            table_name = settings.SUPABASE_MIGRATION_TABLE
            response = supabase.table(table_name).select("*").execute()
            
            if response.data:
                # Convert fetched data to a dictionary for quick lookup
                for record in response.data:
                    # Assuming 'nifi1_component' is the key for lookup
                    component_name = record.get("nifi1_component")
                    if component_name:
                        self._data[component_name.lower().strip()] = record
                print(f"[MigrationPlanProvider] Loaded {len(self._data)} records from Supabase table '{table_name}'.")
            else:
                print(f"[MigrationPlanProvider] No data found in Supabase table '{table_name}'.")

        except Exception as e:
            print(f"[MigrationPlanProvider ERROR] Failed to load data from Supabase: {e}")
            import traceback
            traceback.print_exc()
            self._data = {} # Ensure data is empty on error
        
        self._initialized = True

    def find_component(self, component_name: str):
        """Busca un componente por su nombre en el plan de migración."""
        if not self._data:
            return None
        key = component_name.lower().strip()
        return self._data.get(key)

# Instancia Singleton que será importada por otros módulos
migration_plan_provider = MigrationPlanProvider()
