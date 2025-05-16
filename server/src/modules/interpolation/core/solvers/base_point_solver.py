from abc import ABC, abstractmethod
from decimal import Decimal
from typing import List

from modules.interpolation.core.types import (
    InterpolationValidation,
    PointInterpolationMethod,
    PointInterpolationResult,
)


class BasePointSolver(ABC):

    def __init__(
        self,
        x: List[float | Decimal] | List[Decimal],
        y: List[float | Decimal] | List[Decimal],
        x_value: Decimal,
        m: int,
    ):
        self.xs = [Decimal(x) for x in x]
        self.ys = [Decimal(y) for y in y]
        self.x_value = Decimal(x_value)
        self.n = len(x)
        self.m = m

        if len(x) != len(y):
            raise ValueError("X and Y must have the same length")

    @property
    @abstractmethod
    def point_interpolation_method(self) -> PointInterpolationMethod: ...

    @abstractmethod
    def solve(self) -> PointInterpolationResult: ...

    @abstractmethod
    def validate(self) -> InterpolationValidation: ...
