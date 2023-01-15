import { SliderUnstyled, SliderUnstyledProps } from "@mui/base";

import * as classes from "./styles.css";

interface SliderWithInputProps {
  type: "level" | "skill";
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderWithInput: React.FC<SliderWithInputProps> = (props) => {
  const { type, max, value, onChange } = props;
  const shortLabel = type === "level" ? "Lv" : "Rank";
  const label = type === "level" ? "Operator Level" : "Skill Rank";
  const commonProps: Partial<
    SliderUnstyledProps & React.HTMLProps<HTMLInputElement>
  > = {
    min: 1,
    max,
    value,
  };
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
        {...commonProps}
      />
      <div className={classes.inputContainer}>
        <span className={classes.label}>{shortLabel ?? label}</span>
        <input
          aria-label={label}
          className={classes.input}
          onChange={(e) => onChange(Number(e.target.value))}
          {...commonProps}
        />
        <span>/</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
export default SliderWithInput;
