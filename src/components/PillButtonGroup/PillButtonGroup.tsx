import { useCallback, useEffect, useRef, useState } from "react";
import cx from "clsx";

import * as classes from "./styles.css";
import { spacing } from "../../theme-helpers";

interface Props<T> {
  labels: Array<T>;
  value: T;
  onChange: (newValue: T) => void;
  disabled?: boolean;
}

const eventsToStartAnimatingOn = ["click", "touchstart", "hover"];

const PillButtonGroup = <T extends number | string>({
  labels,
  value,
  onChange,
  disabled,
}: Props<T>) => {
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
      distance + 8
    }px) scaleX(${scaleFactor})`;
    thumbRightRef.current!.style.transform = `translateX(${
      scaleFactor + distance - 8
    }px)`;

    let thumbSideBorderRadius: string;
    if (index === 0) {
      thumbSideBorderRadius = spacing(4, 1, 1, 4);
    } else if (index === labels.length - 1) {
      thumbSideBorderRadius = spacing(1, 4, 4, 1);
    } else {
      thumbSideBorderRadius = spacing(1);
    }
    thumbLeftRef.current!.style.borderRadius = thumbSideBorderRadius;
    thumbRightRef.current!.style.borderRadius = thumbSideBorderRadius;
  }, [labels, value]);

  const beginAnimating = useCallback(() => {
    thumbLeftRef.current!.style.transition = "all 200ms";
    thumbRef.current!.style.transition = "all 200ms";
    thumbRightRef.current!.style.transition = "all 200ms";
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
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={classes.thumbContainer} aria-hidden="true">
        <span className={classes.thumbLeft} ref={thumbLeftRef} />
        <span className={classes.thumb} ref={thumbRef} />
        <span className={classes.thumbRight} ref={thumbRightRef} />
      </div>
    </div>
  );
};
export default PillButtonGroup;
