from __future__ import annotations
import csv
import io
import re
from typing import Iterable, List
from pypdf import PdfReader

def _clean_text(text: str) -> str:
    text = text.replace("\x00", " ").strip()
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text

def parse_txt(data: bytes) -> str:
    return _clean_text(data.decode("utf-8", errors="ignore"))

def parse_md(data: bytes) -> str:
    return _clean_text(data.decode("utf-8", errors="ignore"))

def parse_xml(data: bytes) -> str:
    txt = data.decode("utf-8", errors="ignore")
    attrs = re.findall(r'(?:name|type)="([^"]+)"', txt)
    stripped = re.sub(r"<[^>]+>", " ", txt)
    combined = "\n".join(attrs + [stripped])
    return _clean_text(combined)

def parse_csv(data: bytes) -> str:
    buff = io.StringIO(data.decode("utf-8", errors="ignore"))
    reader = csv.DictReader(buff)
    lines: List[str] = []
    for row in reader:
        parts = []
        for k, v in row.items():
            if k and v and str(v).strip():
                parts.append(f"{k.strip()}: {str(v).strip()}")
        if parts:
            lines.append(" | ".join(parts))
    return _clean_text("\n".join(lines))

def parse_pdf(data: bytes) -> str:
    with io.BytesIO(data) as bio:
        reader = PdfReader(bio)
        pages = []
        for p in reader.pages:
            pages.append(p.extract_text() or "")
        return _clean_text("\n\n".join(pages))

def parse_by_extension(filename: str, data: bytes) -> str:
    name = filename.lower()
    if name.endswith(".txt"):
        return parse_txt(data)
    if name.endswith(".md"):
        return parse_md(data)
    if name.endswith(".xml"):
        return parse_xml(data)
    if name.endswith(".csv"):
        return parse_csv(data)
    if name.endswith(".pdf"):
        return parse_pdf(data)
    return parse_txt(data)
