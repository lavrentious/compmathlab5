import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { InteprolationRequest, InterpolationResponse } from "./types";
import { xsYsToPoints } from "./utils";

export const approximationApi = createApi({
  reducerPath: "approximationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "") + "/api",
  }),
  endpoints: (build) => ({
    approximate: build.mutation<InterpolationResponse, InteprolationRequest>({
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
          points: xsYsToPoints(response.points.xs, response.points.ys),
          data: response.data,
          message: response.message,
          method: response.method,
          success: response.success,
        }) as InterpolationResponse,
    }),
  }),
});

export const { useApproximateMutation } = approximationApi;
