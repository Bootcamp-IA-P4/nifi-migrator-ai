import re
from typing import Dict, Any, List
import os

# Importar librería para PDF. Ejemplo con WeasyPrint (requiere instalación)
# from weasyprint import HTML

def convert_markdown_to_pdf(markdown_content: str, output_path: str):
    """
    Convierte contenido Markdown a un archivo PDF.
    Requiere una librería de terceros como WeasyPrint o wkhtmltopdf.
    """
    try:
        # --- Placeholder para la lógica de conversión a PDF ---
        # Para una implementación real, necesitarías una librería como WeasyPrint o un wrapper de wkhtmltopdf.
        # Ejemplo con WeasyPrint (asegúrate de instalarlo: pip install WeasyPrint)
        # HTML(string=markdown_content).write_pdf(output_path)

        # Para el MVP, podemos guardar el Markdown como un archivo HTML temporal y luego convertirlo
        # o simplemente indicar que la integración de la librería va aquí.
        
        # Por ahora, simulamos la conversión guardando el Markdown como un archivo de texto
        # y dejando un TODO para la integración real de PDF.
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# Informe PDF (simulado)\n\n" + markdown_content)
        print(f"[PDF Converter] Markdown guardado como archivo de texto simulando PDF en: {output_path}")
        print("[PDF Converter] TODO: Integrar una librería real (ej. WeasyPrint) para la conversión a PDF.")

    except Exception as e:
        print(f"Error al convertir Markdown a PDF: {e}")
        raise


def extract_components_from_analyzer_markdown(markdown_report: str) -> str:
    """
    Extrae una representación concisa de los procesadores y servicios de controlador
    del informe Markdown generado por el ANALYZER_AGENT.
    """
    components_summary = []
    current_section = None

    for line in markdown_report.splitlines():
        if line.startswith("## Servicios de Controlador"):
            current_section = "controller_services"
            components_summary.append("## Servicios de Controlador")
        elif line.startswith("## Procesadores"):
            current_section = "processors"
            components_summary.append("## Procesadores")
        elif line.startswith("## Conexiones"):
            current_section = None # Ignorar conexiones para el mapeador
        elif current_section and line.strip().startswith("### "):
            # Extraer nombre y tipo del componente
            name = line.strip().replace("### ", "")
            components_summary.append(f"### {name}")
        elif current_section and line.strip().startswith("- **ID:**"):
            components_summary.append(line.strip())
        elif current_section and line.strip().startswith("- **Tipo:**"):
            components_summary.append(line.strip())
        # Podríamos añadir más lógica para propiedades clave si el mapeador las necesita

    return "\n".join(components_summary)

def parse_markdown_to_json(markdown_text: str) -> Dict[str, Any]:
    """
    Convierte un informe en Markdown a JSON enriquecido
    con soporte para títulos, tablas, listas y texto libre.
    """

    try:
        # -------------------------
        # Funciones auxiliares
        # -------------------------

        def extract_list(md_block: str) -> List[str]:
            """Extraer listas con -, * o numeradas (1., 2., etc.)"""
            if not md_block:
                return []
            return [
                re.sub(r"^\d+\.\s*", "", item).strip("-* ").strip()
                for item in md_block.splitlines()
                if item.strip().startswith(("-", "*")) or re.match(r"^\d+\.\s", item.strip())
            ]

        
        def extract_components(md_block: str) -> List[Dict[str, str]]:
            if not md_block:
                return []

            comps = []
            for line in md_block.splitlines():
                match = re.match(r"[-*]\s*`?(Processor_\d+):\s*([\w]+)`?", line.strip())
                if match:
                    comps.append({
                        "name": match.group(1),
                        "type": match.group(2)
                    })
                else:
                    svc = re.match(r"[-*]\s*`?([\w]+)`?", line.strip())
                    if svc:
                        comps.append({
                            "name": svc.group(1),
                            "type": svc.group(1)
                        })
            return comps

        # -------------------------
        # Extraer secciones por títulos
        # -------------------------

        sections = {}
        matches = re.finditer(r"^(##+)\s*(.*)$", markdown_text, re.MULTILINE)
        positions = [(m.start(), m.group(1), m.group(2)) for m in matches]
        positions.append((len(markdown_text), None, None)) 

        for i in range(len(positions) - 1):
            start, lvl, title = positions[i]
            end, _, _ = positions[i + 1]
            content = markdown_text[start:end].split("\n", 1)
            if len(content) == 2:
                body = content[1].strip()
            else:
                body = ""

            sections[title] = body

        # -------------------------
        # Construir JSON estructurado
        # -------------------------
        
        structured_data = {
            "resumen_ejecutivo": sections.get("Resumen Ejecutivo", ""),
            "analisis_componentes": extract_components(
                sections.get("Análisis de Componentes", "")
                or sections.get("Inventario de Componentes", "")
                or sections.get("Plan de Migración Detallado", "")
            ),
            "puntos_criticos": extract_list(sections.get("Puntos Críticos y Advertencias", "")),
            "recomendaciones": extract_list(
                sections.get("Recomendaciones", "")
                or sections.get("Recomendaciones y Próximos Pasos", "")
            ),
        }

        listas_detectadas = {}
        for title, content in sections.items():
            if any(line.strip().startswith(("-", "*")) for line in content.splitlines()):
                listas_detectadas[title] = extract_list(content)

        return structured_data


    except Exception as e:
        print(f"Error al parsear el Markdown: {e}")
        raise ValueError("No se pudo parsear el informe Markdown a JSON.") from e