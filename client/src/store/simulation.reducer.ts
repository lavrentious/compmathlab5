import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InterpolationResponse,
  PointInterpolationResponse,
} from "src/modules/interpolation/api/types";
import {
  InterpolationMethod,
  Point,
  PointInterpolationMethod,
} from "src/modules/interpolation/types";

interface SimulationState {
  params: {
    points: Point[];
    method: InterpolationMethod; // method for interpolation
    pointMethod: PointInterpolationMethod; // method for point interpolation
    x_value: string; // value for point interpolation
    m: number; // m parameter for point interpolation
  };
  sourceFExpr: string | null;
  result: InterpolationResponse | null;
  pointResult: PointInterpolationResponse | null; // result for point interpolation
  importModalShown: boolean;
}

const initialState: SimulationState = {
  params: {
    points: [],
    method: InterpolationMethod.LAGRANGE,
    pointMethod: PointInterpolationMethod.STIRLING,
    x_value: "",
    m: 2,
  },
  sourceFExpr: null,
  result: null,
  pointResult: null,
  importModalShown: false,
};

const approximationSlice = createSlice({
  name: "approximation",
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<Point[]>) => {
      state.params.points = action.payload;
    },
    setIthPoint(state, action: PayloadAction<{ index: number; point: Point }>) {
      state.params.points[action.payload.index] = action.payload.point;
    },
    deleteIthPoint(state, action: PayloadAction<number>) {
      state.params.points.splice(action.payload, 1);
    },
    addPoint(state, action: PayloadAction<Point>) {
      state.params.points.push(action.payload);
    },
    setResult(state, action: PayloadAction<InterpolationResponse>) {
      state.result = action.payload;
    },
    setMethod(state, action: PayloadAction<InterpolationMethod>) {
      state.params.method = action.payload;
    },
    setImportModalShown(state, action: PayloadAction<boolean>) {
      state.importModalShown = action.payload;
    },
    setSourceFExpr(state, action: PayloadAction<string | null>) {
      state.sourceFExpr = action.payload;
    },
    setPointResult(state, action: PayloadAction<PointInterpolationResponse>) {
      state.pointResult = action.payload;
    },
    setPointMethod(state, action: PayloadAction<PointInterpolationMethod>) {
      state.params.pointMethod = action.payload;
    },
    setXValue(state, action: PayloadAction<string>) {
      state.params.x_value = action.payload;
    },
    setM(state, action: PayloadAction<number>) {
      state.params.m = action.payload;
    },
  },
});

export const {
  setPoints,
  setIthPoint,
  deleteIthPoint,
  addPoint,
  setResult,
  setMethod,
  setImportModalShown,
  setSourceFExpr,
  setPointMethod,
  setPointResult,
  setXValue,
  setM,
} = approximationSlice.actions;
export default approximationSlice.reducer;
