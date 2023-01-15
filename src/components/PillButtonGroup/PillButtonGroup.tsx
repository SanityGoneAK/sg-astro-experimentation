import { useCallback, useEffect, useRef, useState } from "react";
import * as classes from "./styles.css";

interface Props {
  labels: Array<string | number>;
  value: string | number;
  onChange: (newValue: string | number) => void;
}

const eventsToStartAnimatingOn = ["click", "touchstart", "hover"];

const PillButtonGroup: React.FC<Props> = ({ labels, value, onChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonWidths = useRef(Array(labels.length));

  // we have to split the thumb (the active button indicator) into 3 parts
  // so that when we use scaleX, we only scale the rectangular center part;
  // otherwise the border radii get squished
  // see https://css-tricks.com/animating-css-width-and-height-without-the-squish-effect/
  const thumbLeftRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbRightRef = useRef<HTMLSpanElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);

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

  const beginAnimating = useCallback(() => {
    thumbLeftRef.current!.style.transition = "transform 200ms";
    thumbRef.current!.style.transition = "transform 200ms";
    thumbRightRef.current!.style.transition = "transform 200ms";
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) {
      eventsToStartAnimatingOn.forEach((type) => {
        rootRef.current?.addEventListener(type, beginAnimating);
      });
      return () => {
        eventsToStartAnimatingOn.forEach((type) => {
          rootRef.current?.removeEventListener(type, beginAnimating);
        });
      };
    } else {
      eventsToStartAnimatingOn.forEach((type) => {
        rootRef.current?.removeEventListener(type, beginAnimating);
      });
    }
  }, [isAnimating]);

  return (
    <div className={classes.root} ref={rootRef}>
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
