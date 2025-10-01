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