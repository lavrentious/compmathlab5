from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import Callable


class InterpolationMethod(Enum):
    LAGRANGE = "LAGRANGE"
    NEWTON_DIVIDED_DIFFERENCES = "NEWTON_DIVIDED_DIFFERENCES"
    NEWTON_FINITE_DIFFERENCES = "NEWTON_FINITE_DIFFERENCES"


@dataclass
class InterpolationResult:
    f: Callable[[Decimal], Decimal]
    f_expr: str


@dataclass
class InterpolationValidation:
    success: bool
    message: str | None
