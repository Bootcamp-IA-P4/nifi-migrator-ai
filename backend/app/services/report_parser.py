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

        def extract_table(md_block: str) -> List[Dict[str, str]]:
            """Convierte tabla Markdown en lista de dicts"""
            if not md_block:
                return []

            rows = [r.strip() for r in md_block.strip().split("\n") if r.strip()]
            if len(rows) < 2:
                return []

            headers = [h.strip().lower() for h in rows[0].split("|") if h.strip()]
            data_rows = []

            header_map = {
                "componente nifi1": "componente_nifi_1",
                "componente nifi 1": "componente_nifi_1",
                "componente nifi1.x": "componente_nifi_1",  
                "equivalente nifi2": "equivalente_nifi_2",
                "equivalente nifi 2": "equivalente_nifi_2",
                "equivalente nifi2.x": "equivalente_nifi_2", 
                "notas": "notas",
            }

            start_index = 1
            if len(rows) > 1 and set(rows[1].replace("|", "").strip()) <= {"-", " "}:
                start_index = 2

            for row in rows[start_index:]:
                cols = [c.strip() for c in row.split("|")]
                if not any(cols):
                    continue
                mapped = {}
                for i, col in enumerate(cols):
                    if not col:
                        continue
                    key = header_map.get(headers[i], headers[i]) if i < len(headers) else f"col_{i}"
                    mapped[key] = col
                data_rows.append(mapped)

            return data_rows

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
            "analisis_componentes": extract_table(
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
        

        # También incluir TODAS las tablas detectadas
        tablas_detectadas = {}
        for title, content in sections.items():
            if "|" in content and "---" in content:
                tablas_detectadas[title] = extract_table(content)

        # También incluir TODAS las listas detectadas
        listas_detectadas = {}
        for title, content in sections.items():
            if any(line.strip().startswith(("-", "*")) for line in content.splitlines()):
                listas_detectadas[title] = extract_list(content)

        return structured_data


    except Exception as e:
        print(f"Error al parsear el Markdown: {e}")
        raise ValueError("No se pudo parsear el informe Markdown a JSON.") from e