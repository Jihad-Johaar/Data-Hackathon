import os
import json
from normalize import normalize_value
from google import genai


client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)

def split_into_chunks(document, chunk_size=10):
    """
    Split document pages into manageable chunks.

    Each chunk contains at most `chunk_size` pages.
    """

    pages = document.split("\n\nPAGE ")

    chunks = []

    for i in range(0, len(pages), chunk_size):
        chunk = "\n\nPAGE ".join(pages[i:i + chunk_size])
        chunks.append(chunk)

    return chunks

def chunk_pages(pages, chunk_size=10):
    chunks = []

    for i in range(0, len(pages), chunk_size):
        chunks.append(pages[i:i + chunk_size])

    return chunks

def format_chunk(pages):
    sections = []

    for page in pages:
        sections.append(
            f"PAGE {page['page']}\n\n{page['text']}"
        )

    return "\n\n".join(sections)

def extract_evidence(pages):

    prompt = """
You are extracting factual evidence from a company's public financial document.

Extract facts that are explicitly supported by the document.

For every fact, provide:

- category: broad classification of the fact
- fact: concise description of what the fact represents
- value: numerical value when applicable
- unit: unit of measurement
- qualifier: words such as "more than", "less than", "approximately",
  "at least", or "up to" when the source uses them
- period: financial/reporting period when applicable
- event_date: specific date of an event or transaction when applicable
- page: page number where the fact appears
- evidence: short passage supporting the fact

Rules:

1. Do not make recommendations.
2. Do not infer business opportunities.
3. Do not invent missing information.
4. Preserve numerical values accurately.
5. Preserve qualifiers such as "more than", "approximately", or "up to".
6. Distinguish reporting periods from specific event dates.
7. If a field does not apply, return "N/A".
8. Keep evidence short and directly supported by the document.
9. Return only information supported by the document.
"""

    all_facts = []

    # Split the document into chunks of 10 pages
    for i in range(0, len(pages), 10):

        chunk_pages = pages[i:i + 10]

        sections = []

        for page in chunk_pages:
            sections.append(
                f"PAGE {page['page']}\n\n{page['text']}"
            )

        document = "\n\n".join(sections)

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=[
                prompt,
                document
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "OBJECT",
                    "properties": {
                        "company": {
                            "type": "STRING"
                        },
                        "facts": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "category": {
                                        "type": "STRING"
                                    },
                                    "fact": {
                                        "type": "STRING"
                                    },
                                    "value": {
                                        "type": "STRING"
                                    },
                                    "unit": {
                                        "type": "STRING"
                                    },
                                    "qualifier": {
                                        "type": "STRING"
                                    },
                                    "period": {
                                        "type": "STRING"
                                    },
                                    "event_date": {
                                        "type": "STRING"
                                    },
                                    "page": {
                                        "type": "STRING"
                                    },
                                    "evidence": {
                                        "type": "STRING"
                                    }
                                },
                                "required": [
                                    "category",
                                    "fact",
                                    "value",
                                    "unit",
                                    "qualifier",
                                    "period",
                                    "event_date",
                                    "page",
                                    "evidence"
                                ]
                            }
                        }
                    },
                    "required": [
                        "company",
                        "facts"
                    ]
                }
            }
        )

        result = response.text

        if result is None:
            continue

        data = json.loads(result)

        all_facts.extend(data.get("facts", []))

    return {
        "company": "N/A",
        "facts": all_facts
    }