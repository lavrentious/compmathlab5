from decimal import Decimal
from functools import lru_cache
from math import factorial
from typing import List

import sympy as sp  # type: ignore

from modules.interpolation.core.solvers.base_point_solver import BasePointSolver
from modules.interpolation.core.types import (
    InterpolationValidation,
    PointInterpolationMethod,
    PointInterpolationResult,
)
from modules.interpolation.core.utils import to_sp_float


class StirlingSolver(BasePointSolver):
    point_interpolation_method = PointInterpolationMethod.STIRLING
    _offset: int

    def __init__(
        self,
        x: List[float | Decimal] | List[Decimal],
        y: List[float | Decimal] | List[Decimal],
        x_value: Decimal,
    ):
        super().__init__(x, y, x_value)
        self._offset = self.n // 2

    def validate(self) -> InterpolationValidation:
        # FIXME: take odd subset around x_value
        # if self.n % 2 == 0:
        #     return InterpolationValidation(
        #         success=False, message="Number of points must be odd"
        #     )

        # if self.n < 5:
        #     return InterpolationValidation(
        #         success=False, message="Number of points must be at least 5"
        #     )

        hs = [self.xs[i + 1] - self.xs[i] for i in range(len(self.xs) - 1)]
        dhs = [abs(hs[i + 1] - hs[i]) for i in range(len(hs) - 1)]
        if max(dhs) > 1e-6:
            return InterpolationValidation(
                success=False, message="xs are not evenly distributed"
            )
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> PointInterpolationResult:
        x = sp.Symbol("x")
        j = sp.Symbol("j")

        h = self.xs[1] - self.xs[0]
        t = (x - self._get_x(0)) / h
        n = 2

        result_poly: sp.Expr = self._get_y(0)
        for i in range(1, n + 1):
            p = sp.product(t**2 - j**2, (j, 1, i - 1))

            cur = t / factorial(2 * i - 1)
            cur *= p
            cur *= (
                self._compute_offset_fd(2 * i - 1, -(i - 1))
                + self._compute_offset_fd(2 * i - 1, -i)
            ) / 2
            result_poly += cur

            cur = t**2 / factorial(2 * i)
            cur *= p
            cur *= self._compute_offset_fd(2 * i, -i)
            result_poly += cur

        y_value = sp.lambdify(x, result_poly, "math")(to_sp_float(self.x_value))

        return PointInterpolationResult(
            expr=sp.simplify(result_poly).expand(), y_value=Decimal(str(y_value))
        )

    def _get_x(self, index: int) -> sp.Float:
        """
        return xi with offeset (i=0 - central point)
        """
        return to_sp_float(self.xs[self._offset + index])

    def _get_y(self, index: int) -> sp.Float:
        """
        return yi with offeset (i=0 - central point)
        """
        return to_sp_float(self.ys[self._offset + index])

    @lru_cache()
    def _compute_fd(self, order: int, i: int) -> Decimal:
        if order < 0:
            raise ValueError("Order must be non-negative")
        if order == 0:
            return self.ys[i]
        a = self._compute_fd(order - 1, i + 1)
        b = self._compute_fd(order - 1, i)
        return a - b

    def _compute_offset_fd(self, order: int, i: int) -> Decimal:
        return self._compute_fd(order, i + self._offset)
