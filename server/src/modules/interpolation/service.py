from modules.interpolation.core.solvers.base_solver import BaseSolver
from modules.interpolation.core.solvers.lagrange_solver import LagrangeSolver
from modules.interpolation.core.solvers.newton_dd_solver import (
    NewtonDividedDifferencesSolver,
)
from modules.interpolation.core.solvers.newton_fd_solver import (
    NewtonFiniteDifferencesSolver,
)
from modules.interpolation.core.types import InterpolationMethod
from modules.interpolation.schemas import (
    InterpolationData,
    InterpolationRequest,
    InterpolationResponse,
)


class InterpolationService:
    async def interpolate(self, data: InterpolationRequest) -> InterpolationResponse:
        solver: BaseSolver | None = None

        if data.method == InterpolationMethod.NEWTON_DIVIDED_DIFFERENCES:
            solver = NewtonDividedDifferencesSolver(data.points.xs, data.points.ys)
        elif data.method == InterpolationMethod.NEWTON_FINITE_DIFFERENCES:
            solver = NewtonFiniteDifferencesSolver(data.points.xs, data.points.ys)
        elif data.method == InterpolationMethod.LAGRANGE:
            solver = LagrangeSolver(data.points.xs, data.points.ys)

        if not solver:
            raise Exception("Invalid interpolation method")

        validation_res = solver.validate()
        res_data: InterpolationData | None = None
        if validation_res.success:
            res = solver.solve()
            res_data = InterpolationData(f_expr=res.f_expr)
        return InterpolationResponse(
            method=solver.interpolation_method,
            points=data.points,
            success=validation_res.success,
            message=validation_res.message,
            data=res_data,
        )
