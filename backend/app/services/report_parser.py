import re
from typing import Dict, Any, List


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
            """Extraer listas con - o *"""
            if not md_block:
                return []
            return [
                item.strip("-* ").strip()
                for item in md_block.splitlines()
                if item.strip().startswith(("-", "*"))
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
            "analisis_componentes": extract_table(sections.get("Análisis de Componentes", "")),
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

        return {
            "resumen_ejecutivo": sections.get("Resumen Ejecutivo", ""),
            "analisis_componentes": extract_table(sections.get("Análisis de Componentes", "")),
            "puntos_criticos": extract_list(sections.get("Puntos Críticos y Advertencias", "")),
            "recomendaciones": extract_list(sections.get("Recomendaciones", "")),
        }


    except Exception as e:
        print(f"Error al parsear el Markdown: {e}")
        raise ValueError("No se pudo parsear el informe Markdown a JSON.") from e