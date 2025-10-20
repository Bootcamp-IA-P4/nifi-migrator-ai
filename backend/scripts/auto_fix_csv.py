import csv
import os
import sys

def auto_fix_csv(input_csv_path, output_csv_path):
    print(f"Attempting to auto-fix CSV format in {input_csv_path}...")
    fixed_rows = []
    
    try:
        with open(input_csv_path, 'r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            
            header = [h.strip().replace('\ufeff', '') for h in next(reader)] # Clean header
            fixed_rows.append(header)
            expected_fields = len(header)
            
            current_record = []
            for i, row_parts in enumerate(reader):
                if not row_parts: # Skip empty lines
                    continue

                if not current_record:
                    # Start of a new potential record
                    current_record = row_parts
                else:
                    # This is a continuation of the previous record
                    # Heuristic: append parts to the last field of the current_record
                    # This assumes the split happened due to an unescaped newline within a field
                    current_record[-1] += " " + " ".join(row_parts) # Join with space

                # Check if the current_record now has the expected number of fields
                # This is a simplified check. A more robust check would involve
                # trying to parse the current_record as a complete row.
                if len(current_record) == expected_fields:
                    fixed_rows.append(current_record)
                    current_record = [] # Reset for the next record
                elif len(current_record) > expected_fields:
                    # This means there are unescaped commas within a field,
                    # or the heuristic of joining is too aggressive.
                    # For now, we'll treat this as a complete record and log a warning.
                    # A more advanced fix would try to re-split or re-parse.
                    print(f"[AutoFix WARNING] Line {i+1}: Record has too many fields after merging. Appending as is. Row: {current_record}")
                    fixed_rows.append(current_record[:expected_fields]) # Truncate to expected fields
                    current_record = [] # Reset
            
            # Add any remaining current_record if it's complete
            if current_record and len(current_record) == expected_fields:
                fixed_rows.append(current_record)
            elif current_record:
                print(f"[AutoFix WARNING] Incomplete record at end of file: {current_record}. Skipping.")

        # Write fixed rows to output file
        with open(output_csv_path, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)
            writer.writerows(fixed_rows)

        print(f"CSV auto-fixing completed. Fixed rows written to {output_csv_path}.")
        print(f"Original rows: {i+1}, Fixed rows: {len(fixed_rows) - 1}") # Subtract header

    except Exception as e:
        print(f"[AutoFix ERROR] An unexpected error occurred: {e}")
        import traceback
        traceback.print_exc()
        return

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python auto_fix_csv.py <input_csv_path> <output_csv_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    auto_fix_csv(input_path, output_path)
