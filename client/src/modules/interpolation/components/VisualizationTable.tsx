import "katex/dist/katex.min.css";
import React from "react";
import { Badge, Table } from "react-bootstrap";
import { InlineMath } from "react-katex";

import { InterpolationResponse } from "../api/types";
import { fExprToKatex } from "../utils/utils";

interface VisualizationTableProps {
  result: InterpolationResponse;
  precision?: number;
}

const VisualizationTable: React.FC<VisualizationTableProps> = ({ result }) => {
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
