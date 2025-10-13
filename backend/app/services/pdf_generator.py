import os
from weasyprint import HTML
import markdown

def generate_pdf_from_markdown(markdown_path: str, output_path: str):
    """Convierte un archivo Markdown a PDF usando WeasyPrint."""
    if not os.path.exists(markdown_path):
        raise FileNotFoundError(f"No se encontró el archivo Markdown: {markdown_path}")

    # Leer el contenido del markdown
    with open(markdown_path, "r", encoding="utf-8") as f:
        markdown_content = f.read()

    # Convertir Markdown a HTML con formato
    html_content = markdown.markdown(markdown_content, extensions=["fenced_code", "tables"])

    # Plantilla HTML más elegante
    html_template = f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                margin: 40px;
                line-height: 1.6;
                color: #333;
            }}
            h1, h2, h3 {{
                color: #004aad;
            }}
            pre {{
                background: #f4f4f4;
                padding: 10px;
                border-radius: 8px;
                overflow-x: auto;
                font-size: 12px;
            }}
            code {{
                background: #eee;
                padding: 2px 4px;
                border-radius: 4px;
            }}
            table {{
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
            }}
            th, td {{
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f2f2f2;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """

    # Crear el PDF
    HTML(string=html_template).write_pdf(output_path)
    print(f"✅ PDF generado: {output_path}")
    return output_path
