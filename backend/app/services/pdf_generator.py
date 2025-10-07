import markdown2
from weasyprint import HTML

def create_pdf_from_markdown(markdown_content: str) -> bytes:
    # 1. Convertir el Markdown a HTML.
    # El extra "fenced-code-blocks" es importante para que los bloques de código (como Mermaid) se vean bien.
    html_content = markdown2.markdown(
        markdown_content, 
        extras=["fenced-code-blocks", "tables", "cuddled-lists"]
    )

    # 2. Convertir el HTML a PDF usando WeasyPrint.
    # La función write_pdf() devuelve los bytes del PDF.
    pdf_bytes = HTML(string=html_content).write_pdf()

    return pdf_bytes