from dataclasses import dataclass
from enum import Enum

import sympy as sp  # type: ignore


class InterpolationMethod(Enum):
    LAGRANGE = "LAGRANGE"
    NEWTON_DIVIDED_DIFFERENCES = "NEWTON_DIVIDED_DIFFERENCES"
    NEWTON_FINITE_DIFFERENCES = "NEWTON_FINITE_DIFFERENCES"


@dataclass
class InterpolationResult:
    expr: sp.Expr


@dataclass
class InterpolationValidation:
    success: bool
    message: str | None
