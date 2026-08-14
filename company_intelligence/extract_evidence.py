import os
import json

from google import genai


client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)
TARGET_TERMS = {
    "revenue_costs": [
        "revenue",
        "cost of sales",
        "cost of revenue",
        "gross profit",
        "income statement",
        "statement of profit or loss",
    ],

    "foreign_costs_imports": [
        "foreign costs",
        "foreign exchange",
        "forex",
        "imports",
        "import",
        "foreign currency",
        "foreign suppliers",
    ],

    "capital_net_worth": [
        "total equity",
        "shareholders' equity",
        "shareholders equity",
        "net assets",
        "net worth",
        "total capital",
        "capital employed",
    ],

    "debt": [
        "total debt",
        "borrowings",
        "long-term debt",
        "long term debt",
        "short-term debt",
        "short term debt",
        "current borrowings",
        "non-current borrowings",
    ],

    "liquidity": [
        "cash and cash equivalents",
        "cash equivalents",
        "liquidity",
        "current assets",
        "current liabilities",
        "cash flow",
    ],
}

def find_relevant_pages(pages):
    """
    Find pages that contain information relevant to the
    financial metrics required by the consumer.
    """

    relevant_pages = []

    for page in pages:
        text = page.get("text", "").lower()

        matched_categories = []

        for category, terms in TARGET_TERMS.items():

            for term in terms:
                if term in text:
                    matched_categories.append(category)
                    break

        if matched_categories:
            page_copy = dict(page)
            page_copy["matched_categories"] = matched_categories
            relevant_pages.append(page_copy)

    return relevant_pages

def chunk_pages(pages, chunk_size=10):
    """
    Split PDF pages into chunks.

    Each chunk contains at most `chunk_size` pages.
    """

    chunks = []

    for i in range(0, len(pages), chunk_size):
        chunks.append(pages[i:i + chunk_size])

    return chunks


def format_chunk(pages):
    sections = []

    for page in pages:
        categories = ", ".join(
            page.get("matched_categories", [])
        )

        sections.append(
            f"PAGE {page['page']}\n"
            f"RELEVANT CATEGORIES: {categories}\n\n"
            f"{page['text']}"
        )

    return "\n\n".join(sections)


def extract_evidence(pages):

    prompt = """
You are extracting factual evidence from a company's public financial document.

The consumer needs information relating to:

1. Revenue and cost of sales
2. Foreign costs and imports
3. Estimated company capital / net worth
4. Total debt, including short-term and long-term debt
5. Total liquidity

Extract facts only when explicitly supported by the provided pages.

For every fact, provide:

- category
- fact
- value
- unit
- qualifier
- period
- event_date
- page
- evidence

Rules:

1. Do not make recommendations.
2. Do not infer business opportunities.
3. Do not invent missing information.
4. Preserve numerical values accurately.
5. Preserve qualifiers.
6. Distinguish reporting periods from specific event dates.
7. If a field does not apply, return "N/A".
8. Keep evidence short and directly supported by the document.
9. Return only information supported by the provided pages.
10.Do not create a fact whose category, fact, value, page, and evidence
are all "N/A". If no relevant fact is present in the provided pages,
return an empty facts array.
- page: return ONLY the numeric page number, for example "20",
  never "PAGE 20"
"""

    all_facts = []
    company = "N/A"

    relevant_pages = find_relevant_pages(pages)

    chunks = chunk_pages(
        relevant_pages,
        chunk_size=10
    )

    for pages_chunk in chunks:

        document = format_chunk(pages_chunk)

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

        if company == "N/A":
            company = data.get("company", "N/A")

        all_facts.extend(
            data.get("facts", [])
        )

    return {
        "company": company,
        "facts": all_facts
    }