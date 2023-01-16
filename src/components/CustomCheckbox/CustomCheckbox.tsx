import cx from "clsx";
import React from "react";
import * as classes from "./styles.css";

export interface CustomCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox = React.forwardRef<HTMLLabelElement, CustomCheckboxProps>(
  (props, ref) => {
    const { label, disabled, className, onChange, ...rest } = props;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      onChange(e.target.checked);
    };

    return (
      <label
        className={cx(
          className,
          disabled ? classes.label.disabled : classes.label.enabled
        )}
        ref={ref}
      >
        <div className={classes.checkboxContainer}>
          <input
            type="checkbox"
            className={classes.checkboxInput}
            onChange={handleChange}
            {...{ disabled, ...rest }}
          />
          <span className={classes.checkboxControl} aria-hidden="true" />
        </div>
        {label}
      </label>
    );
  }
);
CustomCheckbox.displayName = "CustomCheckbox";
export default CustomCheckbox;
