import re
from typing import List
from app.models.report import StructuredReport, ComponentReport


def parse_markdown_to_json(markdown_text: str) -> StructuredReport:
    """
    Convierte Markdown en un StructuredReport válido para el modelo Report.
    """

    def extract_list(md_block: str) -> List[str]:
        if not md_block:
            return []
        return [
            item.strip("-* ").strip()
            for item in md_block.splitlines()
            if item.strip().startswith(("-", "*"))
        ]

    def extract_table(md_block: str) -> List[ComponentReport]:
        if not md_block:
            return []

        rows = [r.strip() for r in md_block.strip().split("\n") if r.strip()]
        if len(rows) < 2:
            return []

        headers = [h.strip() for h in rows[0].split("|") if h.strip()]
        data_rows = []

        for row in rows[2:]:  # saltamos cabecera y separadores
            cols = [c.strip() for c in row.split("|") if c.strip()]
            if not cols or all(c.startswith("-") for c in cols):
                continue
            data_rows.append(
                ComponentReport(
                    componente_nifi_1=cols[0],
                    equivalente_nifi_2=cols[1] if len(cols) > 1 else "",
                    notas=cols[2] if len(cols) > 2 else "",
                )
            )
        return data_rows

    # Extraer secciones
    sections = {}
    matches = re.finditer(r"^(##+)\s*(.*)$", markdown_text, re.MULTILINE)
    positions = [(m.start(), m.group(2)) for m in matches]
    positions.append((len(markdown_text), None))  # marcador final

    for i in range(len(positions) - 1):
        start, title = positions[i]
        end, _ = positions[i + 1]
        content = markdown_text[start:end].split("\n", 1)
        body = content[1].strip() if len(content) > 1 else ""
        sections[title] = body

    # 🚀 Devolvemos un StructuredReport, no un dict
    return StructuredReport(
        resumen_ejecutivo=sections.get("Resumen Ejecutivo", ""),
        analisis_componentes=extract_table(sections.get("Análisis de Componentes", "")),
        puntos_criticos=extract_list(sections.get("Puntos Críticos y Advertencias", "")),
        recomendaciones=extract_list(sections.get("Recomendaciones", "")),
    )
