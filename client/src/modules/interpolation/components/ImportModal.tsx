import { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setImportModalShown as setImportModalShownAction } from "src/store/simulation.reducer";
import ImportJson from "./ImportJson";
import ImportPreset from "./ImportPreset";
import ImportSourceFExpr from "./ImportSourceFExpr";
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

  return (
    <Modal show={shown} onHide={() => setImportModalShown(false)}>
      <Modal.Header closeButton>Import</Modal.Header>
      <Modal.Body>
        <ImportSourceFExpr onSelect={() => setImportModalShown(false)} />
        <hr />
        or import from preset
        <ImportPreset onSelect={() => setImportModalShown(false)} />
        <hr />
        or import from json
        <ImportJson onSelect={() => setImportModalShown(false)} />
      </Modal.Body>
    </Modal>
  );
};

export default ImportModal;
