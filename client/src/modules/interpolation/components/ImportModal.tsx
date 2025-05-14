import { useCallback } from "react";
import { Dropdown, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import {
  setImportModalShown as setImportModalShownAction,
  setPoints,
} from "src/store/simulation.reducer";
import { Point } from "../types";
import { pointPresets } from "../utils/pointPresets";
const ImportModal = () => {
  const shown = useSelector(
    (state: RootState) => state.simulation.importModalShown,
  );
  const dispatch = useAppDispatch();
  const setImportModalShown = useCallback(
    (shown: boolean) => {
      dispatch(setImportModalShownAction(shown));
    },
    [dispatch],
  );

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
          setImportModalShown(false);
        } catch (err) {
          toast.error("Failed to load JSON: " + (err as Error).message);
        }
      };
      reader.readAsText(file);
    },
    [dispatch, setImportModalShown],
  );

  return (
    <Modal show={shown} onHide={() => setImportModalShown(false)}>
      <Modal.Header closeButton>Import</Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle>from preset</Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.entries(pointPresets).map(([name, points]) => (
              <Dropdown.Item
                key={`preset-${name}`}
                onClick={() => {
                  dispatch(setPoints(points));
                  setImportModalShown(false);
                }}
              >
                {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <hr />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>or import from json</Form.Label>
          <Form.Control
            type="file"
            accept=".json"
            onChange={handleFileChange}
          />
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
};

export default ImportModal;
