from decimal import Decimal
from math import factorial

import sympy as sp  # type: ignore

from modules.interpolation.core.solvers.base_solver import BaseSolver
from modules.interpolation.core.types import (
    InterpolationMethod,
    InterpolationResult,
    InterpolationValidation,
)
from modules.interpolation.core.utils import to_sp_float


class NewtonFiniteDifferencesSolver(BaseSolver):
    interpolation_method = InterpolationMethod.NEWTON_FINITE_DIFFERENCES

    def validate(self) -> InterpolationValidation:
        hs = [self.xs[i + 1] - self.xs[i] for i in range(len(self.xs) - 1)]
        dhs = [abs(hs[i + 1] - hs[i]) for i in range(len(hs) - 1)]
        if max(dhs) > 1e-6:
            return InterpolationValidation(
                success=False, message="xs are not evenly distributed"
            )
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> InterpolationResult:
        h = self.xs[1] - self.xs[0]
        n = len(self.xs)

        x = sp.symbols("x")
        polynomial: sp.Expr = 0
        product_term: sp.Expr = 1
        for i in range(n):
            coeff = to_sp_float(
                self._compute_finite_difference(i, 0) / (factorial(i) * h**i)
            )

            if i > 0:
                product_term *= x - to_sp_float(self.xs[i - 1])
            polynomial += coeff * product_term if i > 0 else coeff

        f_expr: sp.Expr = sp.simplify(polynomial).expand()

        return InterpolationResult(
            expr=f_expr,
        )

    def _compute_finite_difference(self, order: int, i: int) -> Decimal:
        if order < 0:
            raise ValueError("Order must be non-negative")
        if order == 0:
            return self.ys[i]
        a = self._compute_finite_difference(order - 1, i + 1)
        b = self._compute_finite_difference(order - 1, i)
        return a - b
