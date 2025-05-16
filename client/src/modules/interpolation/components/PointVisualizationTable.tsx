import "katex/dist/katex.min.css";
import React from "react";
import { Badge, Table } from "react-bootstrap";
import { InlineMath } from "react-katex";

import { PointInterpolationResponse } from "../api/types";
import { fExprToKatex } from "../utils/utils";

interface PointVisualizationTableProps {
  pointResult: PointInterpolationResponse;
}

const PointVisualizationTable: React.FC<PointVisualizationTableProps> = ({
  pointResult,
}) => {
  return (
    <Table bordered hover responsive className="mb-0">
      <tbody>
        <tr>
          <th>Status</th>
          <td>
            {pointResult.success ? (
              <Badge bg="success">Success</Badge>
            ) : (
              <Badge bg="danger">Failed</Badge>
            )}
          </td>
        </tr>
        <tr>
          <th>Used Method</th>
          <td>{pointResult.method}</td>
        </tr>

        {pointResult.success && (
          <>
            <tr>
              <th>x value</th>
              <td>{pointResult.x_value}</td>
            </tr>
            <tr>
              <th>m (subset half-size)</th>
              <td>{pointResult.m}</td>
            </tr>
            <tr>
              <th>y value</th>
              <td>{pointResult.data.y_value}</td>
            </tr>
            <tr>
              <th>Function</th>
              <td>
                <InlineMath math={fExprToKatex(pointResult.data.f_expr)} />
              </td>
            </tr>
            <tr>
              <th>Subset xs</th>
              <ul className="mb-0 ps-3">
                {pointResult.data.subset_xs.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </tr>
          </>
        )}

        {pointResult.message && (
          <tr>
            <th>Message</th>
            <td>{pointResult.message}</td>
          </tr>
        )}

        <tr>
          <th>calculation time</th>
          <td>{pointResult.time_ms.toFixed(3)} ms</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default PointVisualizationTable;
