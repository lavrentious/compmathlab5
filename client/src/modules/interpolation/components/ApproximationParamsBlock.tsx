import { Card, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setMethod } from "src/store/simulation.reducer";
import { InterpolationMethod } from "../types";

const ApproximationParamsBlock = () => {
  const dispatch = useAppDispatch();
  const { method } = useSelector((state: RootState) => state.simulation.params);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as InterpolationMethod;
    dispatch(setMethod(selected));
  };

  return (
    <Card className="mb-3">
      <Card.Header>Params</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group>
            <Form.Label>Method</Form.Label>
            <InputGroup>
              <Form.Select onChange={handleMethodChange} value={method}>
                {(
                  Object.keys(InterpolationMethod) as Array<
                    keyof typeof InterpolationMethod
                  >
                ).map((key) => (
                  <option key={key} value={key}>
                    {InterpolationMethod[key]}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ApproximationParamsBlock;
