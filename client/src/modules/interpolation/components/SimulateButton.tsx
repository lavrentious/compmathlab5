import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import { setResult } from "src/store/simulation.reducer";
import { useApproximateMutation } from "../api/api";
import { isStrictFloat } from "../utils/utils";

const SimulateButton = () => {
  const { points, method } = useSelector(
    (state: RootState) => state.simulation.params,
  );
  const dispatch = useAppDispatch();
  const [fetch, { isLoading }] = useApproximateMutation();

  const onSubmit = useCallback(() => {
    fetch({
      points: {
        xs: points.map((point) => point.x),
        ys: points.map((point) => point.y),
      },
      method,
    })
      .unwrap()
      .then((data) => {
        dispatch(setResult(data));
      });
  }, [fetch, points, dispatch, method]);

  const disabled = useMemo(() => {
    if (points.some(point => !isStrictFloat(point.x) || !isStrictFloat(point.y))) return true;
    if (points.length < 2) return true;
    const allXsAreUnique =
      Array.from(new Set(points.map((point) => point.x))).length ===
      points.length;
    if (!allXsAreUnique) return true;
  }, [points]);

  return (
    // TODO: disable button
    <LoadingButton isLoading={isLoading} onClick={onSubmit} disabled={disabled}>
      Run
    </LoadingButton>
  );
};

export default SimulateButton;
