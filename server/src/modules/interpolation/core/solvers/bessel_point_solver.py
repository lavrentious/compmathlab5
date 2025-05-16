from decimal import Decimal
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


class BesselSolver(BasePointSolver):
    point_interpolation_method = PointInterpolationMethod.BESSEL
    _offset: int  # index of left central x

    def __init__(
        self,
        x: List[float | Decimal] | List[Decimal],
        y: List[float | Decimal] | List[Decimal],
        x_value: Decimal,
    ):
        super().__init__(x, y, x_value)
        self._offset = (self.n - 1) // 2

    def validate(self) -> InterpolationValidation:
        if self.n % 2 == 1:
            return InterpolationValidation(
                success=False, message="Number of points must be even"
            )

        if self.n < 6:
            return InterpolationValidation(
                success=False, message="Number of points must be at least 6"
            )
        
        x0, x1 = self._get_x(0), self._get_x(1)
        if not (x0 <= self.x_value <= x1):
            return InterpolationValidation(
                success=False,
                message=f"x_value={self.x_value} must lie between central nodes x0={x0} and x1={x1}"
            )

        hs = [self.xs[i + 1] - self.xs[i] for i in range(len(self.xs) - 1)]
        dhs = [abs(hs[i + 1] - hs[i]) for i in range(len(hs) - 1)]
        if max(dhs) > 1e-6:
            return InterpolationValidation(
                success=False, message="xs are not evenly distributed"
            )
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> PointInterpolationResult:

        x = sp.Symbol("x")

        h = self.xs[1] - self.xs[0]
        t = (x - self._get_x(0)) / h
        n = 2

        result_poly: sp.Expr = (self._get_y(0) + self._get_y(1)) / 2
        result_poly += (t - 1 / 2) * self._compute_offset_fd(0, 1)

        ts: sp.Expr = t
        for i in range(1, n + 1):
            ts *= t - i
            cur = ts / factorial(2 * i)
            cur *= (
                self._compute_offset_fd(-i, 2 * i)
                + self._compute_offset_fd(-(i - 1), 2 * i)
            ) / 2

            result_poly += cur

            result_poly += (
                ts
                * (t - 1 / 2)
                / factorial(2 * n + 1)
                * self._compute_offset_fd(-i, 2 * i + 1)
            )

            ts *= t + i

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

    def _compute_fd(self, i: int, order: int) -> Decimal:
        if order == 0:
            return self.ys[i]
        a = self._compute_fd(i + 1, order - 1)
        b = self._compute_fd(i, order - 1)
        return a - b

    def _compute_offset_fd(self, i: int, order: int) -> Decimal:
        return self._compute_fd(i + self._offset, order)
