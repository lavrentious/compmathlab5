import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  InteprolationRequest,
  InterpolationResponse,
  PointInteprolationRequest,
  PointInterpolationResponse,
} from "./types";
import { xsYsToPoints } from "./utils";

export const interpolationApi = createApi({
  reducerPath: "interpolationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/api",
  }),
  endpoints: (build) => ({
    interpolate: build.mutation<InterpolationResponse, InteprolationRequest>({
      query: (data) => ({
        url: "/interpolation/",
        method: "POST",
        body: data,
      }),
      transformResponse: (
        response: InterpolationResponse & {
          points: { xs: string[]; ys: string[] };
        },
      ) =>
        ({
          ...response,
          points: xsYsToPoints(response.points.xs, response.points.ys),
        }) as InterpolationResponse,
    }),
    pointInterpolate: build.mutation<
      PointInterpolationResponse,
      PointInteprolationRequest
    >({
      query: (data) => ({
        url: "/interpolation/point/",
        method: "POST",
        body: data,
      }),
      transformResponse: (
        response: PointInterpolationResponse & {
          points: { xs: string[]; ys: string[] };
        },
      ) =>
        ({
          ...response,
          points: xsYsToPoints(response.points.xs, response.points.ys),
        }) as PointInterpolationResponse,
    }),
  }),
});

export const { useInterpolateMutation, usePointInterpolateMutation } =
  interpolationApi;
