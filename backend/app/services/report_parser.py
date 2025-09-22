import re
from app.models.report import ComponentReport, StructuredReport
from typing import Dict, Any

def parse_markdown_to_json(markdown_text: str) -> Dict[str, Any]:
    try:
        # Extraer cada sección usando expresiones regulares
        resumen = re.search(r"## Resumen Ejecutivo\s*\n(.*?)\n##", markdown_text, re.DOTALL)
        componentes_md = re.search(r"## Análisis de Componentes\s*\n(.*?)\n##", markdown_text, re.DOTALL)
        puntos_criticos_md = re.search(r"## Puntos Críticos y Advertencias\s*\n(.*?)\n##", markdown_text, re.DOTALL)
        recomendaciones_md = re.search(r"## Recomendaciones\s*\n(.*?)(?:\n##|$)", markdown_text, re.DOTALL)

        analisis_componentes = []
        if componentes_md:
            rows = re.findall(r"\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|", componentes_md.group(1))
            for row in rows[1:]: 
                analisis_componentes.append(
                    ComponentReport(
                        componente_nifi_1=row[0].strip(),
                        equivalente_nifi_2=row[1].strip(),
                        notas=row[2].strip()
                    ).dict()
                )

        puntos_criticos = re.findall(r"^\*\s*(.*)", puntos_criticos_md.group(1), re.MULTILINE) if puntos_criticos_md else []
        recomendaciones = re.findall(r"^\*\s*(.*)", recomendaciones_md.group(1), re.MULTILINE) if recomendaciones_md else []

        structured_data = StructuredReport(
            resumen_ejecutivo=resumen.group(1).strip() if resumen else "",
            analisis_componentes=analisis_componentes,
            puntos_criticos=[pc.strip() for pc in puntos_criticos],
            recomendaciones=[r.strip() for r in recomendaciones]
        )

        return structured_data.dict()

    except Exception as e:
        print(f"Error al parsear el Markdown: {e}")
        raise ValueError("No se pudo parsear el informe Markdown a JSON.") from e
