import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterpolationResponse } from "src/modules/interpolation/api/types";
import { InterpolationMethod, Point } from "src/modules/interpolation/types";

interface SimulationState {
  params: {
    points: Point[];
    method: InterpolationMethod;
  };
  sourceFExpr: string | null;
  result: InterpolationResponse | null;
  importModalShown: boolean;
}

const initialState: SimulationState = {
  params: {
    points: [],
    method: InterpolationMethod.LAGRANGE,
  },
  sourceFExpr: null,
  result: null,
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
} = approximationSlice.actions;
export default approximationSlice.reducer;
