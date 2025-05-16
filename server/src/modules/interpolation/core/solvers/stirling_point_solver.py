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


class StirlingSolver(BasePointSolver):
    point_interpolation_method = PointInterpolationMethod.STIRLING
    diff_table: List[List[Decimal]]

    def validate(self) -> InterpolationValidation:
        if self.n % 2 == 0:
            return InterpolationValidation(
                success=False, message="Number of points must be odd"
            )

        if self.n < 5:
            return InterpolationValidation(
                success=False, message="Number of points must be at least 5"
            )

        hs = [self.xs[i + 1] - self.xs[i] for i in range(len(self.xs) - 1)]
        dhs = [abs(hs[i + 1] - hs[i]) for i in range(len(hs) - 1)]
        if max(dhs) > 1e-6:
            return InterpolationValidation(
                success=False, message="xs are not evenly distributed"
            )
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> PointInterpolationResult:
        self.diff_table = self._build_diff_table()

        x = sp.Symbol("x")
        j = sp.Symbol("j")

        h = self.xs[1] - self.xs[0]
        u = (x - self._get_x(0)) / h
        n = 2

        result_poly: sp.Expr = self._get_y(0)
        for i in range(1, n + 1):
            p = sp.product(u**2 - j**2, (j, 1, i - 1))

            cur = u / factorial(2 * i - 1)
            cur *= p
            cur *= (
                self._get_diff(2 * i - 1, -(i - 1)) + self._get_diff(2 * i - 1, -i)
            ) / 2
            result_poly += cur

            cur = u**2 / factorial(2 * i)
            cur *= p
            cur *= self._get_diff(2 * i, -i)
            result_poly += cur

        y_value = sp.lambdify(x, result_poly, "math")(to_sp_float(self.x_value))

        return PointInterpolationResult(
            expr=sp.simplify(result_poly).expand(), y_value=Decimal(str(y_value))
        )

    def _get_x(self, index: int) -> sp.Float:
        """
        return xi with offeset (i=0 - central point)
        """
        return to_sp_float(self.xs[self.n // 2 + index])

    def _get_y(self, index: int) -> sp.Float:
        """
        return yi with offeset (i=0 - central point)
        """
        return to_sp_float(self.ys[self.n // 2 + index])

    def _get_diff(self, order: int, index: int) -> Decimal:
        """
        Возвращает конечную разность порядка `order`, смещенную на index относительно центра.
        """
        center = self.n // 2
        i = center + index
        if 0 <= i < len(self.ys) - order:
            return self.diff_table[order][i]
        return Decimal("0")

    def _build_diff_table(self) -> list[list[Decimal]]:
        """
        Строит таблицу конечных разностей по ys.
        """
        table = [[y for y in self.ys]]
        for i in range(1, self.n):
            prev = table[-1]
            current = [prev[j + 1] - prev[j] for j in range(len(prev) - 1)]
            table.append(current)
        return table
