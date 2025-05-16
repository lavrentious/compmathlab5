import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import { setPointResult } from "src/store/simulation.reducer";
import { usePointInterpolateMutation } from "../api/api";
import { isStrictFloat } from "../utils/utils";

const PointSimulateButton = () => {
  const {
    points,
    pointMethod: method,
    x_value,
    m,
  } = useSelector((state: RootState) => state.simulation.params);
  const dispatch = useAppDispatch();
  const [fetch, { isLoading }] = usePointInterpolateMutation();

  const onSubmit = useCallback(() => {
    fetch({
      points: {
        xs: points.map((point) => point.x),
        ys: points.map((point) => point.y),
      },
      x_value: x_value,
      method,
      m,
    })
      .unwrap()
      .then((data) => {
        dispatch(setPointResult(data));
      });
  }, [fetch, points, x_value, method, dispatch, m]);

  const disabled = useMemo(() => {
    if (
      points.some((point) => !isStrictFloat(point.x) || !isStrictFloat(point.y))
    )
      return true;
    if (points.length < 2) return true;
    const allXsAreUnique =
      Array.from(new Set(points.map((point) => point.x))).length ===
      points.length;
    if (!allXsAreUnique) return true;
  }, [points]);

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={onSubmit}
      disabled={disabled}
      variant="secondary"
    >
      Point
    </LoadingButton>
  );
};

export default PointSimulateButton;
