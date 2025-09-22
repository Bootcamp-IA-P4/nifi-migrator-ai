import requests
import os

# The server is running on http://127.0.0.1:8000
url = "http://127.0.0.1:8000/api/v1/analyze"

# --- CHANGE THIS FILENAME TO TEST DIFFERENT FLOWS ---
filename_to_test = "NiFi_Weather_Flow.xml"

# Construct the absolute path to the file
# The script is in /backend/tests, so we go up one level (..) and then into nifi-flows/nifi-templates
file_path = os.path.join(os.path.dirname(__file__), "..", "nifi-flows", "nifi-templates", filename_to_test)

print(f"Attempting to test with file: {file_path}")

try:
    with open(file_path, 'rb') as f:
        # The 'files' parameter is used to send multipart/form-data
        # We pass the file object directly.
        files = {
            'file': (os.path.basename(file_path), f, 'application/xml')
        }
        
        print(f"Sending request to {url}...")
        response = requests.post(url, files=files)
        
        # Raise an exception if the request was unsuccessful
        response.raise_for_status()
        
        print("\n--- Request Successful! ---")
        # Print the JSON response from the server
        print(response.json())

except FileNotFoundError:
    print(f"\n--- ERROR: FILE NOT FOUND ---")
    print(f"The script could not find the file at the path: {file_path}")
    print("Please ensure the file exists and the path is correct relative to the script location.")
except requests.exceptions.RequestException as e:
    print(f"\n--- ERROR: REQUEST FAILED ---")
    print(f"An error occurred: {e}")
