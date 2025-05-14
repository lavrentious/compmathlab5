import { InterpolationMethod, Point } from "../types";

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
} & (
  | { success: true; message: null; data: InterpolationData }
  | { success: false; message: string | null; data: null }
);
