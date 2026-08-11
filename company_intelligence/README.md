# Company Intelligence API

A Python API that retrieves publicly available company information and returns it as structured company intelligence.

The API searches for relevant public company documents, retrieves supported financial and corporate documents, extracts factual information, normalizes numerical values, and returns the results as JSON.

The intended consumer does not need to interact with the extraction pipeline directly.

They only need to call:

    GET /company/{company_name}/intelligence

---

# 1. Requirements

The project requires:

- Python 3.12 or later
- Internet access
- An Exa API key
- A Gemini API key

The API has been tested with:

- FastAPI
- Uvicorn
- Requests
- PyMuPDF
- Google GenAI

Dependencies are listed in:

    requirements.txt

---

# 2. Project Structure

The project is organized as follows:

    .
    ├── main.py
    ├── public_intelligence.py
    ├── extract_evidence.py
    ├── extract_pdf.py
    ├── normalize.py
    ├── requirements.txt
    ├── README.md
    └── .gitignore

## main.py

Provides the HTTP API using FastAPI.

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

# 8. Run the API

The FastAPI application is contained in `main.py`.

Start the server with:

    uvicorn main:app --host 0.0.0.0 --port 8000

The API will be available at:

    http://localhost:8000

For local development, the server can also be started with:

    uvicorn main:app --reload --host 127.0.0.1 --port 8000

The `--reload` option automatically restarts the server when source files change.

---

# 9. Verify the API

Once the server is running, open:

    http://localhost:8000/docs

FastAPI provides an interactive API documentation interface.

The company intelligence endpoint will appear as:

    GET /company/{company_name}/intelligence

---

# 10. API Endpoint

## Get Company Intelligence

Endpoint:

    GET /company/{company_name}/intelligence

The `company_name` parameter specifies the company for which intelligence should be retrieved.

Example:

    GET /company/MTN%20Group/intelligence

The space in the company name is URL encoded as `%20`.

---

# 11. Calling the API from Python

The consumer only needs the `requests` library.

Example:

    import requests

    company = "MTN Group"

    response = requests.get(
        f"http://localhost:8000/company/{company}/intelligence"
    )

    response.raise_for_status()

    data = response.json()

The resulting `data` object contains the company intelligence as a Python dictionary.

---

# 12. Response Structure

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

# 13. Accessing the Data

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

# 14. Source Information

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

# 15. Normalized Values

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

# 16. Error Responses

## Empty Company Name

An empty company name results in a `400 Bad Request`.

Example:

    {
        "detail": "Company name cannot be empty"
    }

## Successful Request

A successful request returns:

    HTTP 200

with the company intelligence JSON.

## Other Errors

Unexpected errors may result in an HTTP `500` response.

---

# 17. Interactive API Documentation

When the API is running, FastAPI provides interactive documentation at:

    http://localhost:8000/docs

This can be used to test the endpoint without writing a Python client.

---

# 18. Testing from Python

A simple integration test can be performed with:

    import requests

    response = requests.get(
        "http://localhost:8000/company/MTN%20Group/intelligence"
    )

    print("Status:", response.status_code)

    response.raise_for_status()

    data = response.json()

    print("Company:", data["company"])
    print("Sources:", len(data["sources"]))
    print("Facts:", len(data["facts"]))

A successful response should produce:

    Status: 200

along with the requested company and the number of sources and facts returned.

---

# 19. Environment Variables

The following environment variables are required:

    EXA_API_KEY
    GEMINI_API_KEY

These values must be configured before starting the API.

Never commit these values to the repository.

---

# 20. Security

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

# 21. Architecture

The API operates as a pipeline:

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
    PDF Text Extraction
         |
         v
    Evidence Extraction
         |
         v
    Value Normalization
         |
         v
    Structured JSON
         |
         v
    FastAPI
         |
         v
    API Consumer

The API consumer does not need to interact with these internal stages.

The intended interface is the company intelligence endpoint.

---

# 22. API Consumer Workflow

The intended workflow for an external consumer is:

    1. Provide a company name.
    2. Call the company intelligence endpoint.
    3. Receive the JSON response.
    4. Read the returned facts and sources.

Example:

    company = "MTN Group"

    response = requests.get(
        f"http://API_HOST/company/{company}/intelligence"
    )

    response.raise_for_status()

    company_data = response.json()

No direct interaction with Exa, Gemini, PDF extraction, or normalization is required.

---

# 23. Stopping the API

To stop the development server, press:

    Ctrl + C

---

# 24. Deactivating the Virtual Environment

When finished working on the project:

    deactivate

---

# 25. Troubleshooting

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

## Port 8000 is already in use

Start the API on another port:

    uvicorn main:app --host 0.0.0.0 --port 8001

The API will then be available at:

    http://localhost:8001

---

# 26. Development Status

The API currently provides:

- Public company document discovery
- Financial document retrieval
- PDF extraction
- Evidence extraction
- Numerical normalization
- Source tracking
- Structured JSON responses
- HTTP API access through FastAPI

The primary API interface is:

    GET /company/{company_name}/intelligence
