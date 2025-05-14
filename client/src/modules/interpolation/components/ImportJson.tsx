import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useAppDispatch } from "src/store";
import { setPoints } from "src/store/simulation.reducer";
import { Point } from "../types";

interface ImportJsonProps {
  onSelect: () => void;
}

const ImportJson: React.FC<ImportJsonProps> = ({ onSelect }) => {
  const dispatch = useAppDispatch();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) throw new Error("Not an array");
          const valid = parsed.every(
            (p: unknown) =>
              !!p &&
              typeof p === "object" &&
              "x" in p &&
              "y" in p &&
              typeof p.x === "string" &&
              typeof p.y === "string",
          );

          if (!valid) throw new Error("Invalid point format");

          dispatch(setPoints(parsed as Point[]));
          onSelect();
        } catch (err) {
          toast.error("Failed to load JSON: " + (err as Error).message);
        }
      };
      reader.readAsText(file);
    },
    [dispatch, onSelect],
  );

  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Control type="file" accept=".json" onChange={handleFileChange} />
    </Form.Group>
  );
};

export default ImportJson;
