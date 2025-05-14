import React, { useMemo } from "react";
import Plot from "react-plotly.js";

import {
  InterpolationResponse,
  PointInterpolationResponse,
} from "../api/types";
import { fExprToFunction, generatePoints, pointsToXsYs } from "../utils/utils";

interface VisualizationPlotProps {
  result: InterpolationResponse | null;
  pointResult: PointInterpolationResponse | null;
}

const VisualizationPlot: React.FC<VisualizationPlotProps> = ({
  result,
  pointResult,
}) => {
  const fn = useMemo(() => {
    if (!result?.data) return null;
    return fExprToFunction(result.data.f_expr);
  }, [result]);
  const { xs, ys } = useMemo(() => {
    if (!fn || !result?.points) return { xs: [], ys: [] };
    const points = generatePoints(fn, result.points);
    return points;
  }, [result, fn]);
  const { originalXs, originalYs } = useMemo(() => {
    const { xs, ys } = pointsToXsYs(result?.points || []);
    return { originalXs: xs, originalYs: ys };
  }, [result]);

  const plotData = useMemo(() => {
    const ans: Plotly.Data[] = [];

    ans.push({
      x: originalXs || [],
      y: originalYs || [],
      type: "scatter",
      mode: "markers",
      marker: { color: "red", size: 8 },
      name: "input points",
    });

    if (result) {
      ans.push({
        x: xs.map((x) => +x),
        y: ys.map((y) => +y),
        type: "scatter",
        mode: "lines",
        line: { color: "blue" },
        name: "ф(x)",
      });
    }

    if (pointResult && pointResult.success) {
      ans.push({
        x: [pointResult.x_value],
        y: [pointResult.data.y_value],
        type: "scatter",
        mode: "markers",
        marker: { color: "green", size: 8 },
        name: "interpolated point",
      });
    }

    return ans;
  }, [originalXs, originalYs, pointResult, result, xs, ys]);

  return (
    <Plot
      style={{ width: "100%", height: "450px" }}
      useResizeHandler={true}
      config={{ responsive: true }}
      data={plotData}
      layout={{
        title: { text: "Result" },
        xaxis: { title: { text: "x" } },
        yaxis: { title: { text: "ф(x)" } },
        autosize: true,
      }}
    />
  );
};

export default VisualizationPlot;
