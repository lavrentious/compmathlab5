import React from "react";
import { Dropdown } from "react-bootstrap";
import { useAppDispatch } from "src/store";
import { setPoints } from "src/store/simulation.reducer";
import { pointPresets } from "../utils/pointPresets";

interface ImportPresetProps {
  onSelect: () => void;
}

const ImportPreset: React.FC<ImportPresetProps> = ({ onSelect }) => {
  const dispatch = useAppDispatch();

  return (
    <Dropdown>
      <Dropdown.Toggle>Select preset</Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.entries(pointPresets).map(([name, points]) => (
          <Dropdown.Item
            key={`preset-${name}`}
            onClick={() => {
              dispatch(setPoints(points));
              onSelect();
            }}
          >
            {name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ImportPreset;
