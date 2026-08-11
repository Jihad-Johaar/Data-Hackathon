import re


def _clean_number(number):
    """
    Remove floating-point representation artifacts
    when the result is effectively an integer.
    """
    rounded = round(number, 10)

    if rounded.is_integer():
        return int(rounded)

    return number


def normalize_value(value, unit):
    """
    Convert extracted values into machine-readable values.
    """

    if value is None or unit is None:
        return None, unit

    if value == "N/A" or unit == "N/A":
        return None, unit

    unit_lower = unit.lower().strip()

    # Multipliers
    multipliers = {
        "thousand": 1_000,
        "million": 1_000_000,
        "billion": 1_000_000_000,
        "trillion": 1_000_000_000_000,
    }

    multiplier = 1

    for name, factor in multipliers.items():
        if name in unit_lower:
            multiplier = factor
            unit_lower = unit_lower.replace(name, "").strip()
            break

    # Normalize common unit names
    unit_aliases = {
        "zar": "zar",
        "rand": "zar",
        "rands": "zar",
        "%": "%",
        "percent": "%",
        "percentage": "%",
        "cents": "cents",
        "cent": "cents",
    }

    unit_lower = unit_aliases.get(unit_lower, unit_lower)

    # If the unit consisted only of a multiplier,
    # we don't know the underlying semantic unit.
    if not unit_lower:
        unit_lower = None

    # Handle ranges such as:
    # "250 to 300"
    # "250 - 300"
    # "250–300"
    range_match = re.fullmatch(
        r"\s*([\d,]+(?:\.\d+)?)\s*(?:to|-|–)\s*([\d,]+(?:\.\d+)?)\s*",
        value
    )

    if range_match:
        minimum = float(range_match.group(1).replace(",", "")) * multiplier
        maximum = float(range_match.group(2).replace(",", "")) * multiplier

        return {
            "min": _clean_number(minimum),
            "max": _clean_number(maximum)
        }, unit_lower

    # Handle a single numeric value
    try:
        number = float(value.replace(",", ""))

        return _clean_number(number * multiplier), unit_lower

    except ValueError:
        # Preserve values we do not yet know how to normalize.
        return None, unit