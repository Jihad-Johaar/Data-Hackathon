import re


MULTIPLIERS = {
    "thousand": 1_000,
    "million": 1_000_000,
    "billion": 1_000_000_000,
    "trillion": 1_000_000_000_000,

    # Financial-report abbreviations
    "k": 1_000,
    "m": 1_000_000,
    "bn": 1_000_000_000,
}


def _clean_number(number):
    """
    Remove floating-point representation artifacts
    when the result is effectively an integer.
    """

    if number.is_integer():
        return int(number)

    return number


def _clean_numeric_string(value):
    """
    Clean common number formatting found in financial PDFs.

    Examples:
        "16 545"  -> "16545"
        "3 693 484 244" -> "3693484244"
        "(2 188)" -> "-2188"
    """

    value = str(value).strip()

    negative = False

    # Financial statements commonly use parentheses for negatives.
    if value.startswith("(") and value.endswith(")"):
        negative = True
        value = value[1:-1].strip()

    # Remove spaces used as thousands separators.
    value = value.replace(" ", "")

    # Remove commas used as thousands separators.
    value = value.replace(",", "")

    if negative:
        value = "-" + value

    return value


def normalize_value(value, unit):
    """
    Convert extracted financial values into machine-readable values.
    """

    if value is None or unit is None:
        return None, unit

    value = str(value).strip()
    unit = str(unit).strip()

    if value.upper() == "N/A" or unit.upper() == "N/A":
        return None, unit

    unit_lower = str(unit).lower().strip()

        # ---------------------------------------------------------
    # Compound currency units
    # ---------------------------------------------------------

    compound_units = {
        "us$bn": (1_000_000_000, "usd"),
        "us$b": (1_000_000_000, "usd"),
        "us$m": (1_000_000, "usd"),
        "us$mm": (1_000_000, "usd"),

        "zar bn": (1_000_000_000, "zar"),
        "zar m": (1_000_000, "zar"),
        "zar million": (1_000_000, "zar"),
        "zar billion": (1_000_000_000, "zar"),

        "rand bn": (1_000_000_000, "zar"),
        "rand m": (1_000_000, "zar"),
        "rand million": (1_000_000, "zar"),
        "rand billion": (1_000_000_000, "zar"),
    }

    if unit_lower in compound_units:
        multiplier, normalized_unit = compound_units[unit_lower]

    # ---------------------------------------------------------
    # Determine multiplier
    # ---------------------------------------------------------

    multiplier = 1

    # Special financial-report notation.
    if unit_lower in {"'000", "'000s", "000"}:
        multiplier = 1_000
        normalized_unit = None

    elif unit_lower in {"rm", "r m"}:
        multiplier = 1_000_000
        normalized_unit = "zar"

    elif unit_lower in {"rzm"}:
        multiplier = 1_000_000
        normalized_unit = "zar"

    else:
        normalized_unit = unit_lower

        for name, factor in MULTIPLIERS.items():

            # Match the multiplier as a separate unit component.
            if re.search(
                rf"(?<![a-z]){re.escape(name)}(?![a-z])",
                unit_lower
            ):
                multiplier = factor

                normalized_unit = re.sub(
                    rf"(?<![a-z]){re.escape(name)}(?![a-z])",
                    "",
                    normalized_unit
                ).strip()

                break

    # ---------------------------------------------------------
    # Normalize common currency notation
    # ---------------------------------------------------------

    currency_map = {
        "rand": "zar",
        "zar": "zar",
        "r": "zar",
        "rm": "zar",
        "us$": "usd",
        "us$bn": "usd",
        "us$m": "usd",
        "usd": "usd",
        "ngn": "ngn",
    }

    # If the unit still contains a currency + multiplier,
    # clean the currency separately.
    unit_lower = normalized_unit

    if unit_lower in currency_map:
        normalized_unit = currency_map[unit_lower]

    elif unit_lower.startswith("us$"):
        normalized_unit = "usd"

    elif unit_lower.startswith("ngn"):
        normalized_unit = "ngn"

    # ---------------------------------------------------------
    # Handle ranges
    # ---------------------------------------------------------

    cleaned_value = _clean_numeric_string(value)

    range_match = re.fullmatch(
        r"(-?[\d.]+)\s*(?:to|-|–)\s*(-?[\d.]+)",
        cleaned_value
    )

    if range_match:

        minimum = float(range_match.group(1)) * multiplier
        maximum = float(range_match.group(2)) * multiplier

        return {
            "min": _clean_number(minimum),
            "max": _clean_number(maximum)
        }, normalized_unit

    # ---------------------------------------------------------
    # Handle single numeric value
    # ---------------------------------------------------------

    try:
        number = float(cleaned_value)

        return (
            _clean_number(number * multiplier),
            normalized_unit
        )

    except ValueError:
        # Preserve values we don't yet know how to normalize.
        return None, unit