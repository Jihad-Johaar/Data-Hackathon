import json
from pathlib import Path

import yfinance as yf


COMPANY_TICKERS = {
    "Anglo American": "AGL.JO",
    "AngloGold Ashanti": "ANG.JO",
    "Aspen Pharmacare": "APN.JO",
    "BHP Group": "BHG.JO",
    "Bid Corporation": "BID.JO",
    "Clicks Group": "CLS.JO",
    "Glencore": "GLN.JO",
    "Gold Fields": "GFI.JO",
    "MTN Group": "MTN.JO",
    "NEPI Rockcastle": "NRP.JO",
    "Naspers": "NPN.JO",
    "OUTsurance Group": "OUT.JO",
    "Pepkor Holdings": "PPH.JO",
    "Prosus": "PRX.JO",
    "Sanlam": "SLM.JO",
    "Shaftesbury Capital plc": "SHC.JO",
    "Shoprite Holdings": "SHP.JO",
    "The Bidvest Group": "BVT.JO",
    "Valterra Platinum": "VAL.JO",
    "Vodacom Group": "VOD.JO",
}


def get_value(statement, field, period):
    """
    Return a financial value from a yfinance statement.
    Returns None when the value is unavailable.
    """

    if field not in statement.index:
        return None

    if period not in statement.columns:
        return None

    value = statement.loc[field, period]

    if value is None:
        return None

    try:
        if value != value:
            return None
    except TypeError:
        return None

    return float(value)


def get_latest_value(statement, field):
    """
    Return the most recent available value for a field.
    """

    if field not in statement.index:
        return None

    for period in statement.columns:
        value = get_value(statement, field, period)

        if value is not None:
            return value

    return None


def get_company_data(company_name, ticker_symbol):
    """
    Retrieve the financial data required by the consumer.
    """

    ticker = yf.Ticker(ticker_symbol)

    income_statement = ticker.income_stmt
    balance_sheet = ticker.balance_sheet

    revenue = get_latest_value(
        income_statement,
        "Total Revenue"
    )

    cost_of_sales = get_latest_value(
        income_statement,
        "Cost Of Revenue"
    )

    net_worth = get_latest_value(
        balance_sheet,
        "Stockholders Equity"
    )

    total_debt = get_latest_value(
        balance_sheet,
        "Total Debt"
    )

    cash = get_latest_value(
        balance_sheet,
        "Cash And Cash Equivalents"
    )

    short_term_investments = get_latest_value(
        balance_sheet,
        "Other Short Term Investments"
    )

    if cash is not None and short_term_investments is not None:
        total_liquidity = cash + short_term_investments
    elif cash is not None:
        total_liquidity = cash
    elif short_term_investments is not None:
        total_liquidity = short_term_investments
    else:
        total_liquidity = None

    return {
        "entity_name": company_name,
        "revenue": revenue,
        "cost_of_sales": cost_of_sales,
        "foreign_costs_imports": None,
        "net_worth": net_worth,
        "total_debt": total_debt,
        "total_liquidity": total_liquidity,
    }


def get_all_company_financials():
    """
    Retrieve financial data for all 20 corporate clients.

    Returns:
        list[dict]
    """

    results = []

    for company_name, ticker_symbol in COMPANY_TICKERS.items():

        try:
            company_data = get_company_data(
                company_name,
                ticker_symbol
            )

            results.append(company_data)

        except Exception as error:

            results.append({
                "entity_name": company_name,
                "revenue": None,
                "cost_of_sales": None,
                "foreign_costs_imports": None,
                "net_worth": None,
                "total_debt": None,
                "total_liquidity": None,
            })

            print(
                f"Failed to retrieve {company_name}: {error}"
            )

    module_path = Path(__file__).resolve()

    project_root = module_path.parent.parent

    output_path = (
        project_root
        / "pipeline"
        / "analysis"
        / "external_financial.json"
    )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with output_path.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            results,
            file,
            indent=4,
            ensure_ascii=False
        )

    return results