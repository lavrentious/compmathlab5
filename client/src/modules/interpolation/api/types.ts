import { InterpolationMethod, Point, PointInterpolationMethod } from "../types";

export type InteprolationRequest = {
  method: InterpolationMethod;
  points: { xs: string[]; ys: string[] };
};

export type InterpolationData = {
  f_expr: string;
};

export type InterpolationResponse = {
  points: Point[];
  method: InterpolationMethod;
  time_ms: number;
} & (
  | { success: true; message: null; data: InterpolationData }
  | { success: false; message: string | null; data: null }
);

export type PointInteprolationRequest = {
  method: PointInterpolationMethod;
  points: { xs: string[]; ys: string[] };
  x_value: string;
};

export type PointInterpolationData = {
  f_expr: string;
  y_value: string;
};

export type PointInterpolationResponse = {
  points: Point[];
  method: PointInterpolationMethod;
  time_ms: number;
  x_value: string;
} & (
  | { success: true; message: null; data: PointInterpolationData }
  | { success: false; message: string | null; data: null }
);
