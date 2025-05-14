from fastapi import APIRouter

from modules.interpolation.schemas import (
    InterpolationRequest,
    InterpolationResponse,
    PointInterpolationRequest,
    PointInterpolationResponse,
)
from modules.interpolation.service import InterpolationService

interpolation_router = APIRouter(prefix="/interpolation", tags=["Interpolation"])


@interpolation_router.post("/", response_model=InterpolationResponse)
async def interpolate(data: InterpolationRequest) -> InterpolationResponse:
    service = InterpolationService()
    return await service.interpolate(data)


@interpolation_router.post("/point", response_model=PointInterpolationResponse)
async def point_interpolate(
    data: PointInterpolationRequest,
) -> PointInterpolationResponse:
    service = InterpolationService()
    return await service.point_interpolate(data)
