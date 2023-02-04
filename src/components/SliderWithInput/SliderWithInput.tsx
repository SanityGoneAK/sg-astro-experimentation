import { useEffect, useRef, useState } from "react";

import { SliderUnstyled } from "@mui/base";

import * as classes from "./styles.css";

const masteryLevelRegexString = "[Mm](?<masteryLevel>[123])";
const masteryLevelRegex = new RegExp(masteryLevelRegexString);

interface SliderWithInputProps {
  type: "level" | "skill";
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function skillLevelNumberToMasteryLevel(level: number): string {
  if (level > 7) {
    return `M${level - 7}`;
  }
  return `${level}`;
}

const SliderWithInput: React.FC<SliderWithInputProps> = (props) => {
  const { type, max, value, onChange } = props;
  const [rawInput, setRawInput] = useState(`${value}`);
  useEffect(() => {
    setRawInput(
      type === "skill" ? skillLevelNumberToMasteryLevel(value) : `${value}`
    );
  }, [type, value]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.length > `${max}`.length) {
      return;
    }

    setRawInput(e.target.value);
    const match = masteryLevelRegex.exec(e.target.value);
    const newValue = match?.groups?.masteryLevel
      ? Number(match.groups.masteryLevel) + 7
      : Number(e.target.value);
    if (1 <= newValue && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (!inputRef.current?.validity.valid || e.target.value === "") {
      setRawInput(
        type === "skill" ? skillLevelNumberToMasteryLevel(value) : `${value}`
      );
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
          // TODO needs proper focusVisible style using a focus-visible polyfill
          // focusVisible: classes.thumbFocusVisible,
        }}
        onChange={(_, value) => onChange(value as number)}
        min={1}
        max={max}
        value={value}
      />
      <div className={classes.inputContainer}>
        <span className={classes.label}>{shortLabel ?? label}</span>
        <input
          aria-label={label}
          className={classes.input}
          onFocus={(e) => e.target.select()}
          onBlur={handleBlur}
          onChange={handleInputChange}
          min={1}
          max={max}
          value={rawInput}
          ref={inputRef}
          type={type === "level" ? "number" : "text"}
          pattern={type === "skill" ? masteryLevelRegexString : undefined}
        />
        <span>/</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
export default SliderWithInput;
