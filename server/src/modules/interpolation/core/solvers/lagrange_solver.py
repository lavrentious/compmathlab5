import sympy as sp  # type: ignore

from modules.interpolation.core.solvers.base_solver import BaseSolver
from modules.interpolation.core.types import (
    InterpolationMethod,
    InterpolationResult,
    InterpolationValidation,
)
from modules.interpolation.core.utils import to_sp_float


class LagrangeSolver(BaseSolver):
    interpolation_method = InterpolationMethod.LAGRANGE

    def validate(self) -> InterpolationValidation:
        return InterpolationValidation(success=True, message=None)

    def solve(self) -> InterpolationResult:
        x = sp.Symbol("x")
        n = len(self.xs)

        polynomial: sp.Expr = 0
        for i in range(n):
            term: sp.Expr = to_sp_float(self.ys[i])
            for j in range(n):
                if i == j:
                    continue
                num = x - to_sp_float(self.xs[j])
                denom = to_sp_float(self.xs[i] - self.xs[j])
                term *= num / denom
            polynomial += term

        f_expr: sp.Expr = sp.simplify(polynomial).expand()

        return InterpolationResult(
            expr=f_expr,
        )
