import time

from modules.interpolation.core.solvers.base_point_solver import BasePointSolver
from modules.interpolation.core.solvers.base_solver import BaseSolver
from modules.interpolation.core.solvers.bessel_point_solver import BesselSolver
from modules.interpolation.core.solvers.lagrange_solver import LagrangeSolver
from modules.interpolation.core.solvers.newton_dd_solver import (
    NewtonDividedDifferencesSolver,
)
from modules.interpolation.core.solvers.newton_fd_solver import (
    NewtonFiniteDifferencesSolver,
)
from modules.interpolation.core.solvers.stirling_point_solver import StirlingSolver
from modules.interpolation.core.types import (
    InterpolationMethod,
    PointInterpolationMethod,
)
from modules.interpolation.schemas import (
    InterpolationData,
    InterpolationRequest,
    InterpolationResponse,
    PointInterpolationData,
    PointInterpolationRequest,
    PointInterpolationResponse,
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

        start_time = time.perf_counter()
        validation_res = solver.validate()
        res_data: InterpolationData | None = None
        if validation_res.success:
            res = solver.solve()
            f_expr = str(res.expr)
            res_data = InterpolationData(f_expr=f_expr)
        return InterpolationResponse(
            method=solver.interpolation_method,
            points=data.points,
            success=validation_res.success,
            message=validation_res.message,
            data=res_data,
            time_ms=(time.perf_counter() - start_time) * 1000,
        )

    async def point_interpolate(
        self, data: PointInterpolationRequest
    ) -> PointInterpolationResponse:
        solver: BasePointSolver | None = None

        if data.method == PointInterpolationMethod.STIRLING:
            solver = StirlingSolver(
                data.points.xs, data.points.ys, data.x_value, data.m
            )
        elif data.method == PointInterpolationMethod.BESSEL:
            solver = BesselSolver(data.points.xs, data.points.ys, data.x_value, data.m)

        if not solver:
            raise Exception("Invalid interpolation method")

        start_time = time.perf_counter()
        validation_res = solver.validate()
        res_data: PointInterpolationData | None = None
        if validation_res.success:
            res = solver.solve()
            f_expr = str(res.expr)
            res_data = PointInterpolationData(
                f_expr=f_expr, y_value=res.y_value, subset_xs=res.subset_xs
            )

        return PointInterpolationResponse(
            method=solver.point_interpolation_method,
            points=data.points,
            x_value=data.x_value,
            success=validation_res.success,
            message=validation_res.message,
            data=res_data,
            time_ms=(time.perf_counter() - start_time) * 1000,
            m=data.m,
        )
