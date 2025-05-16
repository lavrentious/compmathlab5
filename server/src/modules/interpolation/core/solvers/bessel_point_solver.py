from decimal import Decimal
from functools import lru_cache
from math import factorial
from typing import List, Tuple

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
    _offset: int
    m: int = 2  # TODO: pass with request
    subset_xs: List[Decimal]
    subset_ys: List[Decimal]

    def __init__(
        self,
        x: List[float | Decimal] | List[Decimal],
        y: List[float | Decimal] | List[Decimal],
        x_value: Decimal,
    ):
        super().__init__(x, y, x_value)
        self.subset_xs, self.subset_ys = self._select_nearest_subset()
        self._offset = len(self.subset_xs) // 2 - 1

    def _select_nearest_subset(self) -> Tuple[List[Decimal], List[Decimal]]:
        """
        Выбирает 2m точек, симметрично вокруг ближайшей границы к x_value.
        Для Бесселя точки нумеруются от -m+1 до m
        """
        if len(self.xs) < 2 * self.m:
            return [], []

        points = list(zip(self.xs, self.ys))
        points.sort(key=lambda p: abs(p[0] - self.x_value))
        subset = sorted(points[: 2 * self.m], key=lambda p: p[0])

        return [p[0] for p in subset], [p[1] for p in subset]

    def validate(self) -> InterpolationValidation:
        if len(self.xs) < 2 * self.m:
            return InterpolationValidation(
                success=False,
                message=f"Number of points must be at least 2m={2*self.m}",
            )

        if len(self.subset_xs) != 2 * self.m:
            return InterpolationValidation(
                success=False, message="Failed to construct valid subset"
            )

        x0, x1 = self._get_x(0), self._get_x(1)
        if not (x0 <= self.x_value <= x1):
            return InterpolationValidation(
                success=False,
                message=f"x_value={self.x_value} must lie between central nodes x0={x0} and x1={x1}",
            )

        hs = [
            self.subset_xs[i + 1] - self.subset_xs[i]
            for i in range(len(self.subset_xs) - 1)
        ]
        dhs = [abs(hs[i + 1] - hs[i]) for i in range(len(hs) - 1)]
        if max(dhs) > float("1e-6"):
            return InterpolationValidation(
                success=False, message="xs in subset are not evenly distributed"
            )

        return InterpolationValidation(success=True, message=None)

    def solve(self) -> PointInterpolationResult:
        x = sp.Symbol("x")

        h = self.subset_xs[1] - self.subset_xs[0]
        t = (x - self._get_x(0)) / h
        n = self.m - 1

        result_poly: sp.Expr = (self._get_y(0) + self._get_y(1)) / 2
        result_poly += (t - sp.Rational(1, 2)) * self._compute_offset_fd(1, 0)

        ts: sp.Expr = t
        for i in range(1, n + 1):
            ts *= t - i
            cur = ts / factorial(2 * i)
            cur *= (
                self._compute_offset_fd(2 * i, -i)
                + self._compute_offset_fd(2 * i, -(i - 1))
            ) / 2
            result_poly += cur

            result_poly += (
                ts
                * (t - sp.Rational(1, 2))
                / factorial(2 * i + 1)
                * self._compute_offset_fd(2 * i + 1, -i)
            )

            ts *= t + i

        y_value = sp.lambdify(x, result_poly, "math")(to_sp_float(self.x_value))

        return PointInterpolationResult(
            expr=sp.simplify(result_poly).expand(),
            y_value=Decimal(str(y_value)),
        )

    def _get_x(self, index: int) -> sp.Float:
        """
        return xi with offset (i=0 is the left central point)
        """
        return to_sp_float(self.subset_xs[self._offset + index])

    def _get_y(self, index: int) -> sp.Float:
        """
        return yi with offset (i=0 is the left central point)
        """
        return to_sp_float(self.subset_ys[self._offset + index])

    @lru_cache()
    def _compute_fd(self, order: int, i: int) -> Decimal:
        if order < 0:
            raise ValueError("Order must be non-negative")
        if order == 0:
            return self.subset_ys[i]
        a = self._compute_fd(order - 1, i + 1)
        b = self._compute_fd(order - 1, i)
        return a - b

    def _compute_offset_fd(self, order: int, i: int) -> Decimal:
        return self._compute_fd(order, i + self._offset)
