# Lógica para leer XML y pasar a IA
import xml.etree.ElementTree as ET
from app.models.report import Report

def analyze_nifi_xml(xml_content: bytes) -> Report:
    try:
        tree = ET.fromstring(xml_content)
        processors = [p.attrib.get("name", "unknown") for p in tree.findall(".//processor")]
        
        incompatibilities = []
        if "GetFile" in processors:
            incompatibilities.append("GetFile → reemplazar por FetchFile en NiFi 2.x")

        return Report(
            total_processors=len(processors),
            processors=processors,
            incompatibilities=incompatibilities
        )
    except Exception as e:
        return Report(total_processors=0, processors=[], incompatibilities=[f"Error: {str(e)}"])
