import pandas as pd
import os
import sys

def deduplicate_csv(input_csv_path, output_csv_path, key_column='nifi1_component'):
    print(f"Attempting to deduplicate CSV file: {input_csv_path} based on column '{key_column}'...")
    
    if not os.path.exists(input_csv_path):
        print(f"Error: Input CSV file not found at {input_csv_path}")
        sys.exit(1)

    try:
        df = pd.read_csv(input_csv_path)
        original_rows = len(df)

        # Convert key_column to lowercase for case-insensitive deduplication
        df['temp_key'] = df[key_column].str.lower().str.strip()
        df_deduplicated = df.drop_duplicates(subset='temp_key', keep='first')
        df_deduplicated = df_deduplicated.drop(columns='temp_key') # Remove temporary key column

        deduplicated_rows = len(df_deduplicated)

        if original_rows > deduplicated_rows:
            print(f"Removed {original_rows - deduplicated_rows} duplicate rows.")
            print(f"New total unique rows: {deduplicated_rows}")
        else:
            print("No duplicate rows found.")

        df_deduplicated.to_csv(output_csv_path, index=False)
        print(f"Deduplicated data written to {output_csv_path}.")

    except KeyError:
        print(f"Error: Key column '{key_column}' not found in the CSV file.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred during deduplication: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python deduplicate_csv.py <input_csv_path> <output_csv_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    deduplicate_csv(input_path, output_path)
