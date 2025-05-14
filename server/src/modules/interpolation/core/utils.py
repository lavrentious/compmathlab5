from decimal import Decimal

import sympy as sp  # type: ignore

from config import PRECISION


def to_sp_float(x: Decimal | int | float | sp.Float) -> sp.Float:
    return sp.Float(str(x), PRECISION)
