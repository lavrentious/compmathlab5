import Decimal from "decimal.js";
import React, { useCallback, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import { setPoints, setSourceFExpr } from "src/store/simulation.reducer";
import { useDebounce } from "use-debounce";
import { xsYsToPoints } from "../api/utils";
import { fExprToFunction, generateRange } from "../utils/utils";
import FloatInput from "./FloatInput";

interface ImportSourceFExprProps {
  onSelect: () => void;
}

const ImportSourceFExpr: React.FC<ImportSourceFExprProps> = ({ onSelect }) => {
  const dispatch = useAppDispatch();
  const points = useSelector(
    (state: RootState) => state.simulation.params.points,
  );
  const sourceFExpr = useSelector(
    (state: RootState) => state.simulation.sourceFExpr,
  );
  const [generatePointsEnabled, setGeneratePointsEnabled] =
    useState<boolean>(false);
  const [leftBound, setLeftBound] = useState<string>("0");
  const [rightBound, setRightBound] = useState<string>("0");
  const [generatedPointsCount, setGeneratedPointsCount] = useState(3);

  const [fExpr, setFExpr] = useState<string>(sourceFExpr || "");
  const [debouncedFExpr] = useDebounce(fExpr, 500);

  const fn = useMemo(() => {
    try {
      return fExprToFunction(debouncedFExpr);
    } catch {
      return null;
    }
  }, [debouncedFExpr]);

  const onSubmit = useCallback(() => {
    dispatch(setSourceFExpr(fExpr));
    if (fn) {
      if (generatePointsEnabled) {
        const xs = generateRange(
          new Decimal(leftBound),
          new Decimal(rightBound),
          generatedPointsCount,
        );
        const ys = xs.map((x) => fn(x).toString());
        dispatch(
          setPoints(
            xsYsToPoints(
              xs.map((x) => x.toString()),
              ys,
            ),
          ),
        );
      } else {
        dispatch(
          setPoints(
            points.map((point) => ({
              x: point.x,
              y: fn(new Decimal(point.x)).toString(),
            })),
          ),
        );
      }
    }
    onSelect();
  }, [
    dispatch,
    fExpr,
    fn,
    onSelect,
    generatePointsEnabled,
    leftBound,
    rightBound,
    generatedPointsCount,
    points,
  ]);

  const generatePointsValid = useMemo(() => {
    return (
      !generatePointsEnabled ||
      (generatePointsEnabled &&
        leftBound !== "" &&
        rightBound !== "" &&
        new Decimal(leftBound).lt(new Decimal(rightBound)) &&
        generatedPointsCount > 0)
    );
  }, [generatePointsEnabled, generatedPointsCount, leftBound, rightBound]);

  return (
    <>
      <Form.Group>
        <Form.Label>Function expression</Form.Label>
        <Form.Control
          placeholder="x^2"
          value={fExpr}
          onChange={(e) => {
            setFExpr(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Check
          label="Generate points"
          checked={generatePointsEnabled}
          onChange={(e) => setGeneratePointsEnabled(e.target.checked)}
        />
      </Form.Group>
      {generatePointsEnabled && (
        <>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Left bound</Form.Label>
                <FloatInput
                  value={leftBound}
                  setValue={(v) => setLeftBound(v)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Right bound</Form.Label>
                <FloatInput
                  value={rightBound}
                  setValue={(v) => setRightBound(v)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mt-3">
            <Form.Label>Points count</Form.Label>
            <Form.Control
              type="number"
              value={generatedPointsCount}
              onChange={(e) => setGeneratedPointsCount(Number(e.target.value))}
            />
          </Form.Group>
        </>
      )}

      <LoadingButton
        isLoading={debouncedFExpr !== fExpr}
        onClick={onSubmit}
        disabled={!fn || !fExpr || !generatePointsValid}
        className="mt-3"
      >
        OK
      </LoadingButton>
    </>
  );
};

export default ImportSourceFExpr;
