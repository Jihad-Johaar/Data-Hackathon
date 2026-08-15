## Company Intelligence – Financial Data Module

## 1. Purpose

The `company_intelligence` module provides structured external financial data for the
20 Syn Bank corporate clients.

The module uses Yahoo Finance through `yfinance` to retrieve publicly available
financial information.

The consumer does not need to interact with `yfinance` directly.

The consumer only needs to import and call the provided function.

---

# 2. Requirements

Python 3.10 or newer is recommended.

The module requires the dependencies listed in:

    requirements.txt

---

# 3. Installation

From the project root, create a virtual environment.

## Linux / macOS

    python3 -m venv .venv
    source .venv/bin/activate

## Windows

    python -m venv .venv
    .venv\Scripts\activate

Install the dependencies:

    python -m pip install -r company_intelligence/requirements.txt

---

# 4. Using the Financial Data Module

The module is located at:

    company_intelligence/yfinance_data.py

Import the function:

    from company_intelligence.yfinance_data import get_all_company_financials

Then call:

    data = get_all_company_financials()

No company name or ticker needs to be provided.

The module automatically retrieves data for all 20 configured companies.

---

# 5. Returned Data

The function returns a Python list containing one dictionary for each company.

The structure is:

    [
        {
            "entity_name": "...",
            "revenue": ...,
            "cost_of_sales": ...,
            "foreign_costs_imports": ...,
            "net_worth": ...,
            "total_debt": ...,
            "total_liquidity": ...
        }
    ]

Example:

    from company_intelligence.yfinance_data import get_all_company_financials

    data = get_all_company_financials()

    print(data)

A specific company can then be accessed by iterating over the returned list:

    for company in data:
        print(company["entity_name"])
        print(company["revenue"])
        print(company["total_debt"])

---

# 6. Financial Fields

Each company contains the following fields:

### entity_name

The name of the company.

### revenue

The company's most recent available total revenue reported by Yahoo Finance.

### cost_of_sales

The company's most recent available cost of revenue reported by Yahoo Finance.

### foreign_costs_imports

Foreign costs/import information.

This field is currently not populated by the yfinance data source and may therefore
return `None`.

### net_worth

The company's most recent available stockholders' equity.

### total_debt

The company's most recent available total debt.

### total_liquidity

The company's available cash and short-term investments.

If one of these values is unavailable, the available value is used.

If neither is available, the field returns `None`.

---

# 7. Missing Data

The module does not invent missing financial information.

If a value is unavailable from the source, it is returned as:

    None

Consumers should therefore handle `None` values appropriately.

For example:

    if company["total_debt"] is not None:
        print(company["total_debt"])

---

# 8. Generated Analysis File

When `get_all_company_financials()` is called, the module also saves the retrieved
data as:

    pipeline/analysis/external_financial.json

The required directories are created automatically if they do not already exist.

The JSON file contains the same data returned by the function.

---

# 9. Consumer Workflow

The intended consumer workflow is simply:

    from company_intelligence.yfinance_data import get_all_company_financials

    data = get_all_company_financials()

The consumer receives the Python data structure directly.

At the same time, the module generates:

    pipeline/analysis/external_financial.json

The consumer does not need to:

- provide company names
- provide ticker symbols
- interact with yfinance
- retrieve financial statements manually
- create the output directories
- write the JSON file

---

# 10. Example Consumer Code

    from company_intelligence.yfinance_data import get_all_company_financials

    data = get_all_company_financials()

    for company in data:
        print(f"Company: {company['entity_name']}")
        print(f"Revenue: {company['revenue']}")
        print(f"Cost of Sales: {company['cost_of_sales']}")
        print(f"Foreign Costs / Imports: {company['foreign_costs_imports']}")
        print(f"Net Worth: {company['net_worth']}")
        print(f"Total Debt: {company['total_debt']}")
        print(f"Total Liquidity: {company['total_liquidity']}")
        print()

---

# 11. Important

The `company_intelligence` module is intended to be consumed as a Python module.

The consumer should use:

    get_all_company_financials()

as the interface to the financial data.

Internal implementation details such as ticker mappings and yfinance calls should
not need to be accessed by the consumer.