import { SliderUnstyled, SliderUnstyledProps } from "@mui/base";
import cx from "clsx";

import * as classes from "./styles.css";

type SliderWithInputProps = React.HTMLAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement> & {
    type: "level" | "skill";
    sliderProps?: SliderUnstyledProps;
  };

const SliderWithInput: React.FC<SliderWithInputProps> = (props) => {
  const { type, sliderProps, className, ...rest } = props;
  const shortLabel = type === "level" ? "Lv" : "Rank";
  const label = type === "level" ? "Operator Level" : "Skill Rank";
  return (
    <div className={cx(className, classes.root)}>
      <SliderUnstyled
        aria-label={`${label} slider`}
        className={classes.slider[type]}
        {...sliderProps}
      />
      <span className={classes.label}>
        {shortLabel ?? label}
        <input aria-label={label} className={classes.sliderInput} {...rest} />
      </span>
    </div>
  );
};
export default SliderWithInput;
