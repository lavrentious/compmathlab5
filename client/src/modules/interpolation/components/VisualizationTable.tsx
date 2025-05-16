import "katex/dist/katex.min.css";
import React from "react";
import { Badge, Table } from "react-bootstrap";
import { InlineMath } from "react-katex";

import {
  InterpolationResponse,
  PointInterpolationResponse,
} from "../api/types";
import { fExprToKatex } from "../utils/utils";

interface VisualizationTableProps {
  result: InterpolationResponse;
  pointResult?: PointInterpolationResponse | null;
  precision?: number;
}

const VisualizationTable: React.FC<VisualizationTableProps> = ({
  result,
  pointResult,
}) => {
  return (
    <Table bordered hover responsive className="mb-0">
      <tbody>
        <tr>
          <th>Status</th>
          <td>
            {result.success ? (
              <Badge bg="success">Success</Badge>
            ) : (
              <Badge bg="danger">Failed</Badge>
            )}
          </td>
        </tr>
        <tr>
          <th>Used Method</th>
          <td>{result.method}</td>
        </tr>
        <tr>
          <th>calculation time</th>
          <td>{result.time_ms.toFixed(3)} ms</td>
        </tr>
        {pointResult && (
          <tr>
            <th>point calculation time</th>
            <td>{pointResult.time_ms.toFixed(3)} ms</td>
          </tr>
        )}

        {result.data && (
          <>
            <tr>
              <th>Function</th>
              <td>
                <InlineMath math={fExprToKatex(result.data.f_expr)} />
              </td>
            </tr>
          </>
        )}

        {result.message && (
          <tr>
            <th>Message</th>
            <td>{result.message}</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default VisualizationTable;
