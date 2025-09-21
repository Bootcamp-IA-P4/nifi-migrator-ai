
import sys
import os

# Add the project's root directory to sys.path to allow imports like 'from app.models...'
# This is necessary because we are running this script from the 'backend' directory,
# but the application modules (like app.services.analyzer) expect to be run in a context
# where the 'app' directory is available.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    # We insert at index 1, because index 0 is the script's own directory.
    sys.path.insert(1, project_root)

from app.services.analyzer import analyze_nifi_xml

def main():
    """
    This script is a dedicated test runner for the analyzer service.
    It reads a specific NiFi template XML file, calls the analysis service,
    and prints the generated report to the console.
    
    It must be run from the 'backend' directory.
    """
    # The path is relative to the 'backend' directory
    xml_file_path = 'nifi-flows/nifi-templates/NiFi_Weather_Flow.xml'

    try:
        print(f"--- Reading XML file: {xml_file_path} ---")
        with open(xml_file_path, 'r', encoding='utf-8') as f:
            xml_content_str = f.read()

        # Convert string to bytes for the analyze_nifi_xml function
        xml_content_bytes = xml_content_str.encode('utf-8')

        report = analyze_nifi_xml(xml_content_bytes)

        print("\n--- Analysis Complete. Final Report: ---")
        if report.incompatibilities:
            final_report_md = report.incompatibilities[0]
            print(final_report_md)
        else:
            print("No incompatibilities reported or an error occurred.")

    except FileNotFoundError:
        print(f"Error: XML file not found at {xml_file_path}. Make sure you are running this script from the 'backend' directory.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    main()
