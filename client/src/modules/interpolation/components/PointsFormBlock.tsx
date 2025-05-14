import Decimal from "decimal.js";
import { useMemo } from "react";
import { Badge, Button, Card, Form } from "react-bootstrap";
import { BiImport } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import {
  addPoint,
  deleteIthPoint,
  setImportModalShown,
  setIthPoint,
  setSourceFExpr,
} from "src/store/simulation.reducer";
import { fExprToFunction } from "../utils/utils";
import FloatInput from "./FloatInput";

const PointsFormBlock = () => {
  const dispatch = useAppDispatch();
  const points = useSelector(
    (state: RootState) => state.simulation.params.points,
  );
  const sourceFExpr = useSelector(
    (state: RootState) => state.simulation.sourceFExpr,
  );
  const fn = useMemo(() => {
    if (sourceFExpr) {
      return fExprToFunction(sourceFExpr);
    }
    return null;
  }, [sourceFExpr]);

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between">
        <div>Points</div>
        {sourceFExpr && (
          <div>
            <Badge style={{ borderEndEndRadius: 0, borderStartEndRadius: 0 }}>
              f(x) = {sourceFExpr}
            </Badge>
            <Badge
              bg="danger"
              style={{
                borderEndStartRadius: 0,
                borderStartStartRadius: 0,
                cursor: "pointer",
              }}
              onClick={() => dispatch(setSourceFExpr(null))}
            >
              x
            </Badge>
          </div>
        )}
      </Card.Header>
      <Card.Body>
        {points.length > 0 ? (
          <Form>
            {points.map((_, index) => (
              <Form.Group key={index} className="d-flex">
                <FloatInput
                  className="m-1"
                  value={points[index].x}
                  setValue={(x) =>
                    dispatch(
                      setIthPoint({
                        index,
                        point: {
                          x,
                          y: fn
                            ? fn(new Decimal(x)).toString()
                            : points[index].y,
                        },
                      }),
                    )
                  }
                />
                <FloatInput
                  className="m-1"
                  value={points[index].y}
                  readOnly={!!fn}
                  tabIndex={fn ? -1 : undefined}
                  setValue={(y) =>
                    dispatch(
                      setIthPoint({
                        index,
                        point: { x: points[index].x, y },
                      }),
                    )
                  }
                />
                <Button
                  className="m-1"
                  variant="outline-danger"
                  tabIndex={-1}
                  onClick={() => dispatch(deleteIthPoint(index))}
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
        <Button
          onClick={() =>
            dispatch(
              addPoint({ x: "0", y: fn ? fn(new Decimal(0)).toString() : "0" }),
            )
          }
          variant="success"
        >
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
