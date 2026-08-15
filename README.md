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

| Sector Category | ALPHA | BETA | GAMMA | DELTA | EPSILON |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mining & Resources** | 0.80 | 1.00 | 0.40 | 0.10 | 1.00 |
| **Retail & FMCG** | 1.00 | 0.50 | 0.15 | 0.02 | 0.30 |
| **Telecoms & Tech** | 0.90 | 0.80 | 0.20 | 0.05 | 0.90 |
| **Industrials & Conglomerates** | 0.85 | 0.70 | 0.25 | 0.06 | 0.80 |
| **Financial Services & Insurance** | 0.40 | 0.60 | 0.05 | 0.01 | 0.20 |
| **Healthcare & Pharma** | 0.90 | 0.85 | 0.30 | 0.07 | 0.75 |
| **Real Estate (REITs)** | 0.50 | 0.20 | 0.05 | 0.01 | 0.85 |

## Assumptions

1. **Financial Institutions COGS Proxy:** Banks and insurance companies (e.g., Sanlam, OUTsurance) do not report traditional Cost of Sales. To prevent mathematical failures and under-reporting of transactional wallets, missing COS is imputed as **70% of reported revenue** as an operational expense proxy.
2. **Zero-Value Imputation:** Unreported financial line items (like foreign imports or total debt) default safely to `0` prior to calculation to prevent `NaN` propagation through vector math operations. This almost entirely flattens the foreign imports variable which results in a possible under-estimation of a companies estimated wallet size.
3. **Leakage Definition:** Competitor leakage is defined strictly as the difference between the Total Estimated Wallet and the Bank's Total Captured Wallet (`Estimated Wallet - Captured Wallet`).
4. **Sector Uniformity:** Companies mapped to a specific sector are assumed to share identical structural banking behavior profiles as defined by the multiplier lookup table.
5. **Sector Classification:** Due to the listing of 20 companies, an AI was used to retrieve useful business insight to influence the final multiplier values. In a company with a larger client-base, baseline AI multipliers may be set with individual tweaking made by qualified human agents, this incorporated automation while still maintaining the keen human intuition and experience needed in this industry.

## Limitations
1. Lorem Ipsum.......

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