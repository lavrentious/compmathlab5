from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import List

import sympy as sp  # type: ignore


class InterpolationMethod(Enum):
    LAGRANGE = "LAGRANGE"
    NEWTON_DIVIDED_DIFFERENCES = "NEWTON_DIVIDED_DIFFERENCES"
    NEWTON_FINITE_DIFFERENCES = "NEWTON_FINITE_DIFFERENCES"


class PointInterpolationMethod(Enum):
    STIRLING = "STIRLING"
    BESSEL = "BESSEL"


@dataclass
class InterpolationResult:
    expr: sp.Expr


@dataclass
class PointInterpolationResult:
    expr: sp.Expr
    y_value: Decimal
    subset_xs: List[Decimal]


@dataclass
class InterpolationValidation:
    success: bool
    message: str | None
