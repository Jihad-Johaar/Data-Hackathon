# Data-Hackathon

- Contributors:
    - Analytical Rigor and Data Analysis: Jihad Johaar
    - Graphics Design and Modular Integration: Gugulethu Ndlovu
    - Generative AI and Operations Management: Amukelani Mazibuko
---
# Share of Wallet (SoW) Intelligence Engine
---
## Overview
The Share of Wallet (SoW) Intelligence Engine is a data science pipeline and visualization suite designed for corporate banking analytics. It estimates product wallets, calculates competitor leakage, generates interactive visualizations, and compiles a structured JSON to power downstream GenAI modules and front-end dashboards.

## Repository Architecture

```text
├── pipeline/
│   ├── results.json
│   └── dashboard_assets/
│       ├── general/
│       │   ├── wallet_gap_chart.html
│       │   ├── growth_matrix.html
│       │   └── oppurtunity_heatmap.html
│       └── clients/
├── company_intelligence/
└── dashboard/
```

- **`pipeline/results.json`**: The master data manifest serving as a single source of truth. Contains macro portfolio summaries, client rankings, methodology parameters, and visualization paths.
- **`pipeline/dashboard_assets/general/`**: Portfolio-level interactive HTML charts illustrating wallet gaps, growth prioritization matrices, and cross-sell opportunity heatmaps.
- **`pipeline/dashboard_assets/clients/`**: Client-specific operational drill-down profiles and sub-visualizations.
- **`company_intelligence/`**: Modules handling corporate financial data parsinga and entity mapping.
- **`dashboard/`**: Front-end components and visualization rendering scripts.

---
## Methodology and Financial Engine

The financial engine estimates a corporate client's total banking wallet by scaling reported financial statement line items using specialized sector multipliers. The core wallet is broken down into four product pillars governed by five variables:

*   **ALPHA - Transactional Banking:** Driven by operational throughput, calculated using a weighted fraction of Revenue and Cost of Sales.
*   **BETA - SWIFT / Foreign Exchange:** Measures cross-border settlement and FX processing demands based on foreign costs and import volumes.
*   **GAMMA - Trade Finance (Foreign):** Proxied by foreign trade instruments (e.g., Letters of Credit, Guarantees).
*   **DELTA - Trade Finance (Domestic):** Proxied by domestic supply chain finance requirements (applied to Cost of Sales).
*   **EPSILON - Lending Facilities:** Evaluates corporate borrowing capacity and debt-servicing structures using total reported debt.

## Sector Multipliers Reference Table

# Share of Wallet (SoW) Intelligence Engine: Master Documentation & Integration Guide

| Sector | Trans. Multiplier ($\alpha$) | SWIFT Multiplier ($\beta$) | Trade Multiplier ($\gamma$) | Trade/Cost Multiplier ($\delta$) | Lending Multiplier ($\epsilon$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mining** | $0.80$ | $1.00$ | $0.40$ | $0.10$ | $1.00$ |
| **Retail** | $1.00$ | $0.50$ | $0.15$ | $0.02$ | $0.30$ |
| **Telecoms** | $0.90$ | $0.80$ | $0.20$ | $0.05$ | $0.90$ |
| **Industrials** | $0.85$ | $0.70$ | $0.25$ | $0.06$ | $0.80$ |
| **Financials** | $0.40$ | $0.60$ | $0.05$ | $0.01$ | $0.20$ |
| **Healthcare** | $0.90$ | $0.85$ | $0.30$ | $0.07$ | $0.75$ |
| **Real Estate** | $0.50$ | $0.20$ | $0.05$ | $0.01$ | $0.85$ |


## Model Assumptions, Justifications, Limitations, and Recommendations

### 1. Data-Cleaning & Processing Assumptions
* **Assumption 1:** Duplicate rows in the transactional, SWIFT, and trade finance datasets are categorized strictly as **system errors and are rejected (dropped)**
  * **Justification:** Duplicates represent a very small percentage of the total dataset size (ranging between $0.39\%$ and $0.43\%$)
  * **Limitations:** Dropping duplicates without auditing ledger types or core transaction IDs might accidentally erase legitimate high-frequency corporate transactions (e.g., automated sweeping or recurring settlement entries).
  * **Business Tweaks / Improvements:** Implement a threshold check: if a duplicate matches an identical transaction ID, timestamp, and amount within a 1-second window, flag it for validation rather than blindly deleting it.
* **Assumption 2:** The three datasets (Transactional, SWIFT, and Trade Finance) hold **equal weighting** in the calculation of Share of Wallet (SOW) and are aggregated in their entirety
  * **Justification:** This models the entirety of the bank's data capture due to its sheer scale
  * **Limitations:** Treating transactional flows (high-frequency, lower-margin) the same as trade finance instruments (low-frequency, high-value, long-tenor) skews structural insights. It optimizes for descriptive data precision while sacrificing predictive value
  * **Business Tweaks / Improvements:** Introduce a **weighted fee-income coefficient** for each pillar rather than raw volumetric weighting. Trade finance yields higher margins per rand than basic transactional switching, so volume should be weighted against profitability.
* **Assumption 3:** Banks and insurance companies (e.g., Sanlam, OUTsurance) do not report traditional Cost of Sales. To prevent mathematical failures and under-reporting of transactional wallets, missing COS is imputed as **70% of reported revenue** as an operational expense proxy.
    * **Justification:** A $70\%$ baseline serves as an expert proxy to reflect the heavy cost-to-income and claims burdens characteristic of the sector. Applying a uniform $70\%$ multiplier (${\text{revenue}} \times 0.70$) prevents distorted outliers in cross-sector Share of Wallet (SOW) models, allowing analysts to scale financial sector data alongside capital-intensive industries like mining and telecoms.
    * **Limitations:** A blanket $70\%$ cost-of-sales proxy treats life insurers (like Sanlam), property and casualty insurers (like OUTsurance), and asset managers identically. In reality, their cost structures—comprising claims ratios, administration expenses, and commission payouts—differ significantly. Because the estimation relies heavily on financial statement ratios to derive proxy metrics, an inaccurate cost-of-sales assumption directly skews the calculated Share of Wallet (SOW) and lending or trade multipliers for financial sector clients.
    * **Business Tweaks / Improvements:** eplace the uniform $70\%$ rule for all financial institutions with tailored benchmarks that distinguish between life insurers (like Sanlam) and short-term or property and casualty insurers (like OUTsurance) to better capture their underlying claims and commission structures.

---

### 2. Context & Independence Assumptions
* **Assumption 3:** Consideration of "Inbound vs. Outbound" directionality assumes **independence of the data sets and neglects broader context**, leading to it being sidelined
  * **Justification:** The direction categorical variable is simplified exclusively to measure gross flow direction per company rather than modeling complex multi-party trade network loops
  * **Limitations:** Ignoring payment corridors and flow topology hides supply-chain relationships and cross-border leakage trends.
  * **Business Tweaks / Improvements:** Retain corridor maps to trace whether outflows to international accounts lead back to sister entities, illuminating hidden global treasury structures.

---

### 3. Financial & Sector Multiplier Assumptions
The notebook relies heavily on sector-specific deterministic intensity mappings and multipliers ($\alpha, \beta, \gamma, \delta, \epsilon$) applied to external financial statement metrics (Revenue, Cost of Sales, Total Debt) to compute estimated customer wallets.

* **Assumptions behind Multipliers:** 
  * Capital-heavy sectors (Mining, Industrials) require higher debt and lending multipliers ($\epsilon$ up to $1.00$) and heavier foreign cost intensities (e.g., Mining foreign intensity mapped at $40\%$).
  * Financial institutions (Sanlam, OUTsurance) have their Cost of Sales defaulted to $70\%$ of revenue (${\text{revenue}} \times 0.70$) to normalize non-standard bank income statements.
* **Justifications:** These ratios encode **expert business insight** to bridge the gap between public balance sheets and missing transactional granularity.
* **Limitations:** Static multipliers assume homogeneous banking behavior across all companies within a sector. For instance, treating Glencore identically to Valterra Platinum purely based on the "Mining" label disregards structural variations in trade finance needs.
* **Business Tweaks / Improvements:**
  * Transition from static sector-wide coefficients to **dynamic, tier-based multipliers** driven by enterprise size, credit ratings, and historical treasury behaviors.
  * Continuously backtest estimated wallets against known primary-bank client accounts to recalibrate coefficients dynamically.

---
## JSON Fields
---
The `results.json` is the contact between the analytical pipeline and dashboard and GenAI components. 

### GenAI Component
The GenAI assistant uses these fields to enable it to answer natural language queries with data-accurate financial backing and methodology explanations:
- **`portfolio_summary`**: Macro-level metrics across the entire client book (Total Estimated Wallet, Total Captured, Total Leakage, Average Penetration).
- **`methodology_parameters`**: Contains the full breakdown of `sector_multipliers` and documented `assumptions` (e.g., the 70% COGS proxy). Allows the model to explain *why* and *how* values were calculated.
- **`client_rankings_and_data`**: An array of corporate profiles including `opportunity_rank`, exact ZARbn estimations, competitor leakage, and sector classifications. Used for answering client-specific queries and comparing gaps.

### Dashboard Component
The front-end dashboard uses these fields to populate UI widgets, data tables, and dynamic chart embeds without needing to recalculate backend logic:
- **`portfolio_summary`**: Hydrates top-level KPI metric cards.
- **`client_rankings_and_data`**: Populates sortable data tables/grids for executive drill-downs (Columns: Rank, Client, Sector, Wallet, Leakage, Share of Wallet %).
- **`visualization`**: Contains paths for rendering interactive HTML assets via `<iframe>` embeds. It is broken down into:
  - `portfolio_level`: Paths for the Wallet Gap Chart, Growth Matrix, and Opportunity Heatmap.
  - `client_drill_downs`: Nested paths per entity pointing to their dynamically generated individual `profile_subplot`, `cash_cycle`, and `trade_mix` visual files.


# INSTALLATION AND EXECUTION
---
## 1. Requirements
- Python 3.10 or newer is required for all dependencies.
- Jupyter Notebook is used for Data Analysis and to load all plots and information for use in the Dashboard
- All dependencies are listed in:

    ```text
    requirements.txt
    ```

## 2. Dependencies Installation
From the root directory run the following command in the terminal:

```bash
python -m pip install -r company_intelligence/requirements.txt
```

## 3. Opening Jupyter Notebook
Open a terminal in the root directory and run:

```bash
jupyter notebook
```

This opens a notebook session in your browser where the Data_Analysis.ipynb file may be opened. Executing all the cell blocks at once refreshes all the data and images for a fresh new session on the dashboard.