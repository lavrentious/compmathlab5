import Decimal from "decimal.js";
import React, { useCallback, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import { setPoints, setSourceFExpr } from "src/store/simulation.reducer";
import { useDebounce } from "use-debounce";
import { fExprToFunction } from "../utils/utils";

interface ImportSourceFExprProps {
  onSelect: () => void;
}

const ImportSourceFExpr: React.FC<ImportSourceFExprProps> = ({ onSelect }) => {
  const dispatch = useAppDispatch();
  const points = useSelector(
    (state: RootState) => state.simulation.params.points,
  );

  const [fExpr, setFExpr] = useState<string>("");
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
      dispatch(
        setPoints(
          points.map((point) => ({
            x: point.x,
            y: fn(new Decimal(point.x)).toString(),
          })),
        ),
      );
    }
    onSelect();
  }, [onSelect, fExpr, dispatch, fn, points]);

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
      <LoadingButton
        isLoading={debouncedFExpr !== fExpr}
        onClick={onSubmit}
        disabled={!fn || !fExpr}
        className="mt-3"
      >
        OK
      </LoadingButton>
    </>
  );
};

export default ImportSourceFExpr;
