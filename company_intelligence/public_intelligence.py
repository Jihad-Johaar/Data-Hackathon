import os
import json
import requests
import re
from datetime import datetime, timezone 

from extract_pdf import extract_pdf_text
from extract_evidence import extract_evidence
from normalize import normalize_value

from google import genai


EXA_API_KEY = os.environ["EXA_API_KEY"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

gemini = genai.Client(
    api_key=GEMINI_API_KEY
)


def search_company(company_name):
    url = "https://api.exa.ai/search"

    headers = {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "query": f"{company_name} annual financial results",
        "numResults": 5
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    response.raise_for_status()

    results = response.json()["results"]

    for result in results:
        result["source_type"] = classify_source(
            result.get("url", "")
            )

        result["document_type"] = classify_document(
          result.get("title",""),
          result.get("url","")  
        )
    return results


def download_document(url):
    url = clean_url(url)

    if not url:
        raise ValueError("Invalid URL")

    response = requests.get(
        url,
        timeout=30,
        headers={
            "User-Agent": "Mozilla/5.0"
        }
    )

    response.raise_for_status()

    return response.content

def classify_source(url):
    if "senspdf.jse.co.za" in url:
        return "sens"

    if "cipc.co.za" in url:
        return "cipc"

    return "public"

def classify_document(title, url):
    text = f"{title} {url}".lower()

    text = text.replace("-", " ")
    text = text.replace("_", " ")

    if (
        "annual report" in text
        or "annual financial statement" in text
        or "annual financial statements" in text
    ):
        return "annual_financial_statement"

    if (
        "annual results" in text
        or "full year results" in text
        or "full-year results" in text
        or "financial results" in text
        or "preliminary results" in text
        or "reviewed results" in text
    ):
        return "financial_results"

    if (
        "sens" in text
        or "press release" in text
        or "corporate announcement" in text
    ):
        return "corporate_announcement"

    return "general_public_information"

def retrieve_document(result):
    url = result.get("url")

    if not url:
        return None

    try:
        content = download_document(url)

        return {
            "url": url,
            "content": content,
            "size": len(content),
            "resource_type": detect_resource_type(content)
        }

    except requests.RequestException:
        return None

def clean_url(url):
    match = re.search(r"https?://[^\s\]\)]+", url)

    if not match:
        return None

    return match.group(0)

def detect_resource_type(content):
    if content.startswith(b"%PDF-"):
        return "pdf"

    if content.startswith(b"<!DOCTYPE html") or b"<html" in content[:1000].lower():
        return "html"

    return "unknown"

def format_pages_for_ai(pages):
    sections = []

    for page in pages:
        sections.append(
            f"PAGE {page['page']}\n\n{page['text']}"
        )

    return "\n\n".join(sections)

def process_document(result):
    document = retrieve_document(result)

    if document is None:
        return None

    if document["resource_type"] != "pdf":
        return None

    pages = extract_pdf_text(document["content"])

    evidence = extract_evidence(pages)

    return {
        "url": result.get("url"),
        "title": result.get("title"),
        "source_type": result.get("source_type"),
        "document_type": result.get("document_type"),
        "evidence": evidence
    }

def get_company_intelligence(company_name):
    company_name = company_name.strip()

    if not company_name:
        raise ValueError("Company name cannot be empty")

    results = search_company(company_name)
    for result in results:
        print("\nTITLE:", result.get("title"))
        print("URL:", result.get("url"))
        print("SOURCE:", result.get("source_type"))
        print("DOCUMENT:", result.get("document_type"))

    facts = []
    sources = []

    for result in results:
        document_type = result.get("document_type")

        if document_type not in {
            "annual_financial_statement",
            "financial_results",
            "corporate_announcement"
        }:
            continue

        processed = process_document(result)

        if processed is None:
            continue

        evidence = processed["evidence"]

        source_id = f"source_{len(sources) + 1:03d}"

        sources.append({
            "source_id": source_id,
            "title": processed.get("title"),
            "url": processed.get("url"),
            "source_type": processed.get("source_type"),
            "document_type": processed.get("document_type")
        })

        for fact in evidence.get("facts", []):
            normalized_value, normalized_unit = normalize_value(
                fact.get("value"),
                fact.get("unit")
            )

            fact["normalized_value"] = normalized_value
            fact["normalized_unit"] = normalized_unit
            fact["source_id"] = source_id

            facts.append(fact)

    return {
        "company": company_name,
        "retrieval_timestamp": datetime.now(timezone.utc).isoformat(),
        "sources": sources,
        "facts": facts
    }