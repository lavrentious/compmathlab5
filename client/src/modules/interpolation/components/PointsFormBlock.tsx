import { useCallback, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { BiImport } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import {
  addPoint as addPointAction,
  deleteIthPoint as deleteIthPointAction,
  setImportModalShown,
  setIthPoint as setIthPointAction,
} from "src/store/simulation.reducer";
import { isStrictFloat } from "../utils/utils";

const PointsFormBlock = () => {
  const dispatch = useAppDispatch();
  const points = useSelector(
    (state: RootState) => state.simulation.params.points,
  );

  // Local string values to allow partial float input
  const [localInputs, setLocalInputs] = useState<{ x: string; y: string }[]>(
    [],
  );

  // Sync localInputs with redux points when they change
  useEffect(() => {
    setLocalInputs(
      points.map((p) => ({ x: p.x.toString(), y: p.y.toString() })),
    );
  }, [points]);

  const updateLocal = (index: number, coord: "x" | "y", value: string) => {
    setLocalInputs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [coord]: value };
      return next;
    });
  };

  const handleBlur = (index: number) => {
    const { x, y } = localInputs[index];
    const parsedX = isStrictFloat(x) ? x : "0";
    const parsedY = isStrictFloat(y) ? y : "0";
    dispatch(setIthPointAction({ index, point: { x: parsedX, y: parsedY } }));
  };

  const addPoint = useCallback(() => {
    dispatch(addPointAction({ x: "0", y: "0" }));
  }, [dispatch]);

  const deleteIthPoint = useCallback(
    (index: number) => {
      dispatch(deleteIthPointAction(index));
    },
    [dispatch],
  );

  return (
    <Card className="mb-3">
      <Card.Header>Points</Card.Header>
      <Card.Body>
        {points.length > 0 ? (
          <Form>
            {points.map((_, index) => (
              <Form.Group key={index} className="d-flex">
                <Form.Control
                  className="m-1"
                  type="text"
                  inputMode="decimal"
                  value={localInputs[index]?.x ?? ""}
                  onChange={(e) => updateLocal(index, "x", e.target.value)}
                  onBlur={() => handleBlur(index)}
                />
                <Form.Control
                  className="m-1"
                  type="text"
                  inputMode="decimal"
                  value={localInputs[index]?.y ?? ""}
                  onChange={(e) => updateLocal(index, "y", e.target.value)}
                  onBlur={() => handleBlur(index)}
                />
                <Button
                  className="m-1"
                  variant="outline-danger"
                  tabIndex={-1}
                  onClick={() => deleteIthPoint(index)}
                >
                  &minus;
                </Button>
              </Form.Group>
            ))}
          </Form>
        ) : (
          <div className="text-center">No points</div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex  justify-content-between">
        <Button onClick={addPoint} variant="success">
          +
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch(setImportModalShown(true))}
        >
          <BiImport /> Import
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PointsFormBlock;
