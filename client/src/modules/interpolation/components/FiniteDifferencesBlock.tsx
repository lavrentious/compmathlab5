import Decimal from "decimal.js";
import { useCallback } from "react";
import { Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const FiniteDifferencesBlock = () => {
  const points = useSelector(
    (state: RootState) => state.simulation.params.points,
  );

  const computeFD = useCallback(
    (order: number, index: number): Decimal | null => {
      if (index + order >= points.length) {
        return null;
      }

      if (order === 0) {
        return new Decimal(points[index].y);
      }

      const a = computeFD(order - 1, index + 1);
      const b = computeFD(order - 1, index);

      return a && b ? a.minus(b) : null;
    },
    [points],
  );

  return (
    <Card>
      <Card.Header>Finite differences</Card.Header>
      <Card.Body>
        <Table bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>xi</th>
              <th>yi</th>
              {Array.from({ length: points.length - 1 }).map((_, i) => (
                <th key={`delta-${i + 1}-yi`}>Δ{i + 1}yi</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {points.map((_, i) => (
              <tr key={`row-${i + 1}`}>
                <td>{i + 1}</td>
                <td>{points[i].x}</td>
                <td>{points[i].y}</td>
                {Array.from({ length: points.length - 1 }).map((_, order) => (
                  <td key={`delta-${order + 1}-yi-${i}`}>
                    {(computeFD(order + 1, i) || "").toString()}
                    {/* order={order + 1}, i={i} */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default FiniteDifferencesBlock;
