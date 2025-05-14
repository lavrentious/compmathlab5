import { Card, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setPointMethod, setXValue } from "src/store/simulation.reducer";
import { PointInterpolationMethod } from "../types";
import FloatInput from "./FloatInput";

const PointInterpolationParamsBlock = () => {
  const dispatch = useAppDispatch();
  const { pointMethod, x_value } = useSelector(
    (state: RootState) => state.simulation.params,
  );

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as PointInterpolationMethod;
    dispatch(setPointMethod(selected));
  };

  return (
    <Card className="mb-3">
      <Card.Header>Params</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Method</Form.Label>
            <Form.Select onChange={handleMethodChange} value={pointMethod}>
              {(
                Object.keys(PointInterpolationMethod) as Array<
                  keyof typeof PointInterpolationMethod
                >
              ).map((key) => (
                <option key={key} value={key}>
                  {PointInterpolationMethod[key]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>X</Form.Label>
            <FloatInput
              value={x_value}
              setValue={(value) => dispatch(setXValue(value))}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PointInterpolationParamsBlock;
