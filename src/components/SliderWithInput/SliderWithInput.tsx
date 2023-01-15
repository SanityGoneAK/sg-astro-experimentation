import { SliderUnstyled } from "@mui/base";
import { useEffect, useState } from "react";

import * as classes from "./styles.css";

interface SliderWithInputProps {
  type: "level" | "skill";
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderWithInput: React.FC<SliderWithInputProps> = (props) => {
  const { type, max, value, onChange } = props;
  const [rawInput, setRawInput] = useState(`${value}`);
  useEffect(() => {
    setRawInput(`${value}`);
  }, [value]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRawInput(e.target.value);
    const newValue = Number(e.target.value);
    if (1 <= newValue && newValue <= max) {
      onChange(newValue);
    }
  };

  const shortLabel = type === "level" ? "Lv" : "Rank";
  const label = type === "level" ? "Operator Level" : "Skill Rank";

  return (
    <div className={classes.root}>
      <SliderUnstyled
        aria-label={`${label} slider`}
        classes={{
          root: classes.slider,
          track: classes.track[type],
          rail: classes.rail,
          thumb: classes.thumb,
          active: classes.thumbActive,
          focusVisible: classes.thumbFocusVisible,
        }}
        onChange={(_, value) => onChange(value as number)}
        min={1}
        max={max}
        value={value}
      />
      <div className={classes.inputContainer}>
        <span className={classes.label}>{shortLabel ?? label}</span>
        <input
          type="number"
          aria-label={label}
          className={classes.input}
          onFocus={(e) => e.target.select()}
          onChange={handleInputChange}
          min={1}
          max={max}
          value={rawInput}
        />
        <span>/</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
export default SliderWithInput;
