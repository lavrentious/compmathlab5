from decimal import Decimal
from typing import List, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from config import FORMAT_STR
from modules.interpolation.core.types import (
    InterpolationMethod,
    PointInterpolationMethod,
)


class CustomBaseModel(BaseModel):
    model_config = ConfigDict(json_encoders={Decimal: lambda v: FORMAT_STR.format(v)})


class PointsList(CustomBaseModel):
    xs: List[Decimal] = Field(min_length=2)
    ys: List[Decimal] = Field(min_length=2)

    @model_validator(mode="after")
    def length_match(self) -> "PointsList":
        if len(self.xs) != len(self.ys):
            raise ValueError("Lengths of xs and ys must match")
        return self

    @model_validator(mode="after")
    def xs_unique(self) -> "PointsList":
        if len(set(self.xs)) != len(self.xs):
            raise ValueError("All xs must be unique")
        return self

    @field_validator("xs", "ys", mode="before")
    @classmethod
    def coerce_to_decimal(cls, values: List[Union[str, float]]) -> List[Decimal]:
        try:
            return [Decimal(v) for v in values]
        except Exception:
            raise ValueError(
                "All coordinates must be floats or strings representing floats"
            )


class InterpolationRequest(CustomBaseModel):
    points: PointsList
    method: InterpolationMethod


class InterpolationData(CustomBaseModel):
    f_expr: str


class InterpolationResponse(CustomBaseModel):
    method: InterpolationMethod
    points: PointsList
    success: bool
    message: str | None = None
    data: InterpolationData | None
    time_ms: float


class PointInterpolationRequest(CustomBaseModel):
    points: PointsList
    method: PointInterpolationMethod
    x_value: Decimal
    m: int = Field(gt=0)  # half-size for points subset

    @field_validator("x_value", mode="before")
    @classmethod
    def coerce_x_value_to_decimal(cls, value: str | float) -> Decimal:
        try:
            return Decimal(value)
        except Exception:
            raise ValueError("X value must be a float or string representing a float")


class PointInterpolationData(CustomBaseModel):
    f_expr: str
    y_value: Decimal
    subset_xs: List[Decimal]


class PointInterpolationResponse(CustomBaseModel):
    method: PointInterpolationMethod
    points: PointsList
    x_value: Decimal
    m: int
    success: bool
    message: str | None = None
    data: PointInterpolationData | None
    time_ms: float
