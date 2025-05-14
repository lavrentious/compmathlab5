from abc import ABC, abstractmethod
from decimal import Decimal
from typing import List

from modules.interpolation.core.types import (
    InterpolationMethod,
    InterpolationResult,
    InterpolationValidation,
)


class BaseSolver(ABC):

    def __init__(
        self,
        x: List[float | Decimal] | List[Decimal],
        y: List[float | Decimal] | List[Decimal],
    ):
        self.xs = [Decimal(x) for x in x]
        self.ys = [Decimal(y) for y in y]
        self.n = len(x)

        if len(x) != len(y):
            raise ValueError("X and Y must have the same length")

    @property
    @abstractmethod
    def interpolation_method(self) -> InterpolationMethod: ...

    @abstractmethod
    def solve(self) -> InterpolationResult: ...

    @abstractmethod
    def validate(self) -> InterpolationValidation: ...
