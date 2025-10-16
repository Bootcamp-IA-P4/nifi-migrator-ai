import os
import sys
import pandas as pd

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.supabase_registry import upload_csv_to_supabase
from app.core.config import settings

if __name__ == "__main__":
    # Construct the absolute path to the CSV file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    csv_file_path = os.path.join(base_dir, "data", "migration_plan_fixed.csv")
    
    supabase_table_name = settings.SUPABASE_MIGRATION_TABLE

    if not os.path.exists(csv_file_path):
        print(f"Error: CSV file not found at {csv_file_path}")
        sys.exit(1)

    print(f"Attempting to upload {csv_file_path} to Supabase table {supabase_table_name}...")
    result = upload_csv_to_supabase(csv_file_path, supabase_table_name)

    if result.get("status") == "ok":
        print(f"Successfully uploaded {result.get('inserted_count')} records to Supabase.")
    else:
        print(f"Failed to upload CSV to Supabase: {result.get('detail')}")
        sys.exit(1)
