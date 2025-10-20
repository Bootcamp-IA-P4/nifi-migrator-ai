import os
import sys
import pandas as pd

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.supabase_registry import upload_csv_to_supabase, truncate_table # Import truncate_table
from app.core.config import settings

if __name__ == "__main__":
    # Construct the absolute path to the CSV file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    csv_file_path = os.path.join(base_dir, "backend", "data", "migration_plan_fixed.csv")
    
    supabase_table_name = settings.SUPABASE_MIGRATION_TABLE

    if not os.path.exists(csv_file_path):
        print(f"Error: CSV file not found at {csv_file_path}")
        sys.exit(1)

    # Truncate the table before uploading new data
    print(f"Attempting to truncate Supabase table {supabase_table_name}...")
    truncate_result = truncate_table(supabase_table_name)
    if truncate_result.get("status") == "error":
        print(f"Failed to truncate table: {truncate_result.get('detail')}")
        sys.exit(1)
    print(f"Successfully truncated {truncate_result.get('deleted_count')} records from {supabase_table_name}.")


    print(f"Attempting to upload {csv_file_path} to Supabase table {supabase_table_name}...")
    result = upload_csv_to_supabase(csv_file_path, supabase_table_name)

    if result.get("status") == "ok":
        print(f"Successfully uploaded {result.get('inserted_count')} records to Supabase.")
    else:
        print(f"Failed to upload CSV to Supabase: {result.get('detail')}")
        sys.exit(1)
