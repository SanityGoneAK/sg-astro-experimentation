import { useEffect, useRef } from "react";
import * as classes from "./styles.css";

interface Props {
  labels: Array<string | number>;
  value: string | number;
  onChange: (newValue: string | number) => void;
}

const PillButtonGroup: React.FC<Props> = ({ labels, value, onChange }) => {
  const buttonWidths = useRef(Array(labels.length));

  // we have to split the thumb (the active button indicator) into 3 parts
  // so that when we use scaleX, we only scale the rectangular center part;
  // otherwise the border radii get squished
  // see https://css-tricks.com/animating-css-width-and-height-without-the-squish-effect/
  const thumbLeftRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbRightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // now that we've mounted, show the thumb
    // (otherwise it distractingly animates as the page loads)
    thumbLeftRef.current!.removeAttribute("hidden");
    thumbRef.current!.removeAttribute("hidden");
    thumbRightRef.current!.removeAttribute("hidden");
  }, []);

  // translate the thumb to the correct position when index changes
  useEffect(() => {
    const index = labels.indexOf(value);
    if (index < 0) {
      throw new Error(`${value} is not contained in labels: ${labels}`);
    }

    const distance = buttonWidths.current
      .slice(0, index)
      .reduce((a, b) => a + b, 0);
    thumbLeftRef.current!.style.transform = `translateX(${distance}px)`;
    const scaleFactor = buttonWidths.current[index] - 16;
    thumbRef.current!.style.transform = `translateX(${
      distance + 8 - 1
    }px) scaleX(${scaleFactor + 2})`;
    thumbRightRef.current!.style.transform = `translateX(${
      scaleFactor + distance + 8
    }px)`;
  }, [labels, value]);

  return (
    <div className={classes.root}>
      <div className={classes.buttonWrapper} role="group">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            aria-pressed={value === label}
            className={classes.button}
            ref={(el) => {
              buttonWidths.current[i] = el?.getBoundingClientRect().width;
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={classes.thumbContainer} aria-hidden="true">
        <span className={classes.thumbLeft} ref={thumbLeftRef} hidden />
        <span className={classes.thumb} ref={thumbRef} hidden />
        <span className={classes.thumbRight} ref={thumbRightRef} hidden />
      </div>
    </div>
  );
};
export default PillButtonGroup;
