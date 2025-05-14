from decimal import Decimal
from typing import List

import sympy as sp  # type: ignore

from modules.interpolation.core.solvers.base_solver import BaseSolver
from modules.interpolation.core.types import (
    InterpolationMethod,
    InterpolationResult,
    InterpolationValidation,
)
from modules.interpolation.core.utils import to_sp_float


class NewtonDividedDifferencesSolver(BaseSolver):
    interpolation_method = InterpolationMethod.NEWTON_DIVIDED_DIFFERENCES

    def validate(self) -> InterpolationValidation:
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> InterpolationResult:
        x = sp.Symbol("x")
        n = len(self.xs)

        # divided differences
        coefficients = [
            self._compute_divided_difference(list(range(i + 1))) for i in range(n)
        ]

        polynomial: sp.Expr = 0
        product_term: sp.Expr = 1
        for i in range(n):
            coeff = to_sp_float(coefficients[i])
            if i > 0:
                product_term *= x - to_sp_float(self.xs[i - 1])
            polynomial += coeff * product_term if i > 0 else coeff

        f_expr: sp.Expr = sp.simplify(polynomial).expand()

        f_lambdified = sp.lambdify(x, f_expr, "math")

        return InterpolationResult(
            f=lambda x_val: Decimal(f_lambdified(to_sp_float(x_val))),
            f_expr=str(f_expr),
        )

    def _compute_divided_difference(self, indexes: List[int]) -> Decimal:
        order = len(indexes)
        if order == 1:
            return self.ys[indexes[0]]
        return (
            self._compute_divided_difference(indexes[1:])
            - self._compute_divided_difference(indexes[:-1])
        ) / (self.xs[indexes[-1]] - self.xs[indexes[0]])
