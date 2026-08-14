# Company Intelligence

A Python module that retrieves publicly available company information and returns it as structured company intelligence.

The module searches for relevant public company documents, including financial reports and SENS announcements, retrieves supported documents, extracts factual information, normalizes numerical values, and returns the results as a structured Python dictionary.

The consumer does not need to interact with the search, document retrieval, PDF extraction, AI extraction, or normalization pipeline directly.

They only need to import the module and call:

    from public_intelligence import get_company_intelligence

    result = get_company_intelligence("MTN Group")

The returned `result` contains the company information, source documents, and extracted facts in a structured format.

---

# 1. Requirements

The project requires:

- Python 3.12 or later
- Internet access
- An Exa API key
- A Gemini API key

Dependencies are listed in:

    requirements.txt

---

# 2. Project Structure

The project is organized as follows:

    .
    ├── public_intelligence.py
    ├── extract_evidence.py
    ├── extract_pdf.py
    ├── normalize.py
    ├── requirements.txt
    ├── README.md
    └── .gitignore

## public_intelligence.py

Controls the company intelligence retrieval pipeline.

## extract_evidence.py

Extracts structured factual evidence from retrieved documents.

## extract_pdf.py

Extracts text and page information from PDF documents.

## normalize.py

Converts extracted numerical values into machine-readable values.

## requirements.txt

Contains the Python dependencies required to run the project.

---

# 3. Installation

## 3.1 Clone the repository

Clone the repository using Git:

    git clone <repository-url>

Enter the project directory:

    cd <project-directory>

---

# 4. Create a Virtual Environment

A virtual environment keeps the project's Python dependencies separate from the system Python installation.

## Linux

Run:

    python3 -m venv .venv

## macOS

Run:

    python3 -m venv .venv

## Windows

Using PowerShell or Command Prompt:

    py -m venv .venv

---

# 5. Activate the Virtual Environment

## Linux

Run:

    source .venv/bin/activate

The terminal should now display something similar to:

    (.venv) user@computer:~/project$

## macOS

Run:

    source .venv/bin/activate

The terminal should now display something similar to:

    (.venv) user@computer project %

## Windows PowerShell

Run:

    .venv\Scripts\Activate.ps1

The terminal should display:

    (.venv) PS C:\project>

If PowerShell prevents the activation script from running, execute:

    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Then activate the environment again:

    .venv\Scripts\Activate.ps1

## Windows Command Prompt

Run:

    .venv\Scripts\activate.bat

---

# 6. Install Dependencies

Make sure the virtual environment is activated.

Then run:

    pip install -r requirements.txt

This installs all dependencies required by the project.

---

# 7. Configure API Keys

The application requires two API keys:

- `EXA_API_KEY`
- `GEMINI_API_KEY`

Do not place API keys directly into the source code.

Do not commit API keys to Git.

## Linux

Run:

    export EXA_API_KEY="your_exa_api_key"
    export GEMINI_API_KEY="your_gemini_api_key"

These variables will remain available for the current terminal session.

## macOS

Run:

    export EXA_API_KEY="your_exa_api_key"
    export GEMINI_API_KEY="your_gemini_api_key"

These variables will remain available for the current terminal session.

## Windows PowerShell

Run:

    $env:EXA_API_KEY="your_exa_api_key"
    $env:GEMINI_API_KEY="your_gemini_api_key"

These variables will remain available for the current PowerShell session.

## Windows Command Prompt

Run:

    set EXA_API_KEY=your_exa_api_key
    set GEMINI_API_KEY=your_gemini_api_key

These variables will remain available for the current Command Prompt session.
---
## 8. Usage

After completing the environment setup, the consumer can use the module directly from Python:

    from public_intelligence import get_company_intelligence

    result = get_company_intelligence("Company name")

    print(result["company"])
    print(result["facts"])
---
# 9. Response Structure

The API returns JSON in the following general structure:

    {
        "company": "MTN Group",
        "retrieval_timestamp": "...",
        "sources": [
            {
                "source_id": "source_001",
                "title": "...",
                "url": "...",
                "source_type": "...",
                "document_type": "..."
            }
        ],
        "facts": [
            {
                "category": "...",
                "fact": "...",
                "value": "...",
                "unit": "...",
                "qualifier": "...",
                "period": "...",
                "event_date": "...",
                "page": "...",
                "evidence": "...",
                "normalized_value": 123456,
                "normalized_unit": "...",
                "source_id": "source_001"
            }
        ]
    }

---

# 10. Accessing the Data

The main fields returned by the API are:

    data["company"]

    data["retrieval_timestamp"]

    data["sources"]

    data["facts"]

Each item in `facts` represents an extracted factual data point.

For example:

    for fact in data["facts"]:
        print(fact["fact"])
        print(fact["normalized_value"])
        print(fact["normalized_unit"])

The original extracted value and supporting evidence are also retained.

---

# 11. Source Information

Each source is assigned a `source_id`.

Example:

    {
        "source_id": "source_001",
        "title": "2025 Annual Financial Results",
        "url": "...",
        "source_type": "public",
        "document_type": "financial_results"
    }

Facts reference their originating source using `source_id`.

For example:

    {
        "fact": "Total reported revenue",
        "normalized_value": 226707,
        "normalized_unit": "rm",
        "source_id": "source_001"
    }

This allows a consumer to associate an extracted fact with its original document.

---

# 12. Normalized Values

Where possible, numerical values are converted into machine-readable values.

For example:

    "10 million"

becomes:

    normalized_value: 10000000

and:

    normalized_unit: null

Similarly:

    "R16.6 billion"

becomes approximately:

    normalized_value: 16600000000

    normalized_unit: "zar"

The original `value` and `unit` fields are preserved.

Normalization does not replace the original extracted information.

---

# 13. Error Responses

## Empty Company Name

An empty or whitespace-only company name raises:

    ValueError("Company name cannot be empty")


---

# 14. Environment Variables

The following environment variables are required:

    EXA_API_KEY
    GEMINI_API_KEY

These values must be configured before starting the API.

Never commit these values to the repository.

---

# 15. Security

API keys must not be:

- committed to Git
- included in source code
- included in `README.md`
- included in example code
- shared publicly

The `.gitignore` file should include:

    .venv/
    __pycache__/
    *.pyc
    .env

If environment variables are stored using a `.env` file for local development, that file must not be committed.

---

# 16. Architecture

The company intelligence system operates as an internal Python pipeline:

    Company Name
         |
         v
    Public Search
         |
         v
    Document Retrieval
         |
         v
    Document Classification
         |
         v
    Document Selection
         |
         v
    PDF Text Extraction
         |
         v
    Relevant Page Detection
         |
         v
    Chunked Evidence Extraction
         |
         v
    Value Normalization
         |
         v
    Structured Python Dictionary
         |
         v
    Consumer Python Code

The consumer does not need to interact with any of the internal stages.

The intended interface is:

    get_company_intelligence(company_name)

The function handles the complete retrieval and extraction pipeline and returns the resulting company intelligence as a structured Python dictionary.

---

# 17. Consumer Workflow

The intended workflow for the consumer is:

    1. Set up the Python environment.
    2. Configure the required API keys.
    3. Import the company intelligence module.
    4. Provide a company name.
    5. Call `get_company_intelligence()`.
    6. Receive the structured company intelligence.
    7. Read the returned facts and sources.

Example:

    from public_intelligence import get_company_intelligence

    company_data = get_company_intelligence("MTN Group")

    print(company_data["company"])
    print(company_data["facts"])
    print(company_data["sources"])

No direct interaction with Exa, Gemini, PDF extraction, document classification,
document selection, or normalization is required.

The consumer only interacts with:

    get_company_intelligence(company_name)

---


# 18. Deactivating the Virtual Environment

When finished working on the project:

    deactivate

---

# 19. Troubleshooting

## `python3: command not found`

Verify that Python is installed:

    python3 --version

On Windows:

    py --version

## `pip: command not found`

Try:

    python3 -m pip --version

or on Windows:

    py -m pip --version

## Virtual environment will not activate

Verify that `.venv` exists:

    ls -la

On Windows:

    dir

If it does not exist, recreate it using the instructions above.

## Missing API key

Verify that the required environment variables are set.

Linux/macOS:

    echo $EXA_API_KEY
    echo $GEMINI_API_KEY

Windows PowerShell:

    echo $env:EXA_API_KEY
    echo $env:GEMINI_API_KEY

# 20. Development Status

The company intelligence module currently provides:

- Public company document discovery
- Financial document and SENS retrieval
- Document classification and selection
- PDF text extraction
- Relevant page detection
- Chunked evidence extraction
- Numerical value normalization
- Source tracking
- Structured company intelligence

The primary consumer interface is:

    get_company_intelligence(company_name)

The function returns the retrieved company information as a structured Python dictionary containing the company, source documents, and extracted facts.