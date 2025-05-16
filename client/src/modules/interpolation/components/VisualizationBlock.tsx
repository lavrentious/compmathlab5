import { useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import { BiExport } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import PointVisualizationTable from "./PointVisualizationTable";
import VisualizationPlot from "./VisualizationPlot";
import VisualizationTable from "./VisualizationTable";

const ApproximationVisualizationBlock = () => {
  const { result, pointResult } = useSelector(
    (state: RootState) => state.simulation,
  );

  const downloadJson = useCallback(() => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <Card>
      <Card.Header>Results</Card.Header>
      <Card.Body>
        {result || pointResult ? (
          <>
            <VisualizationPlot result={result} pointResult={pointResult} />
          </>
        ) : (
          <p>No results yet</p>
        )}
        {result && (
          <>
            <h5>Interpolation result</h5>
            <VisualizationTable result={result} />
          </>
        )}
        <hr />
        {pointResult && (
          <>
            <h5>Point interpolation result</h5>
            <PointVisualizationTable pointResult={pointResult} />
          </>
        )}
      </Card.Body>
      {result && (
        <Card.Footer>
          <Button onClick={downloadJson} variant="secondary">
            <BiExport /> Export to json
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ApproximationVisualizationBlock;
