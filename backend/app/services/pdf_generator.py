# app/services/pdf_generator.py
import os
import markdown
from weasyprint import HTML

def generate_pdf_from_markdown(markdown_path: str, output_path: str) -> str:
    """
    Convierte un archivo Markdown en un PDF estilizado usando WeasyPrint.
    """
    if not os.path.exists(markdown_path):
        raise FileNotFoundError(f"No se encontró el archivo Markdown: {markdown_path}")

    with open(markdown_path, "r", encoding="utf-8") as f:
        markdown_content = f.read()

    html_content = markdown.markdown(markdown_content, extensions=["fenced_code", "tables"])

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
            h1, h2, h3 {{ color: #004aad; }}
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
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """

    # Usa solo HTML de WeasyPrint
    HTML(string=html_template).write_pdf(target=output_path)
    print(f"✅ PDF generado correctamente: {output_path}")
    return output_path
