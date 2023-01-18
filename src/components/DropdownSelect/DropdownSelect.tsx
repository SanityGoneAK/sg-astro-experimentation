import React, { useEffect, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import { Listbox, Transition } from "@headlessui/react";
import cx from "clsx";
import { usePopper } from "react-popper";

import * as classes from "./styles.css";

export const DropdownOption = <T,>(
  props: React.HTMLAttributes<HTMLLIElement> & {
    value: T;
    disabled?: boolean;
  }
) => <Listbox.Option<"li", T> {...props} />;

type Props<T> = React.PropsWithChildren<{
  buttonContent: React.ReactNode;
  value: T;
  onChange: (newValue: T) => void;
  classes?: {
    button?: string;
  };
  disabled?: boolean;
}>;

export interface DropdownSelectRef {
  button: HTMLButtonElement | null;
}

const DropdownSelectInner = <T,>(
  props: Props<T>,
  ref: React.ForwardedRef<DropdownSelectRef>
) => {
  const {
    buttonContent,
    value,
    onChange,
    disabled,
    classes: customClasses,
    children,
  } = props;
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "flip",
        enabled: false,
      },
    ],
  });
  useImperativeHandle(ref, () => ({
    button: referenceElement,
  }));

  return (
    <Listbox<"div", T>
      as="div"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <Listbox.Button<"button">
        className={cx(customClasses?.button, classes.button)}
        ref={setReferenceElement}
      >
        {buttonContent}
        <svg
          className={classes.dropdownIcon}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.33393 5.84832C5.1495 6.05056 4.8505 6.05056 4.66607 5.84832L0.139264 0.88407C-0.158232 0.557826 0.052466 8.40332e-08 0.473188 1.20814e-07L9.52681 9.12307e-07C9.94753 9.49088e-07 10.1582 0.557827 9.86074 0.88407L5.33393 5.84832Z"
            fill="#E8E8F2"
          />
        </svg>
      </Listbox.Button>
      <Portal>
        <Transition<"div">
          className={classes.transition.base}
          enterFrom={classes.transition.enterFrom}
          enterTo={classes.transition.enterTo}
          leaveFrom={classes.transition.leaveFrom}
          leaveTo={classes.transition.leaveTo}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Listbox.Options<"ul"> className={classes.options}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement<typeof Listbox.Option<"li", T>>(child)) {
                return React.cloneElement(child, {
                  // @ts-expect-error force className stacking onto Listbox.Option
                  className: cx(child.props.className, classes.option),
                });
              }
            })}
          </Listbox.Options>
        </Transition>
      </Portal>
    </Listbox>
  );
};
DropdownSelectInner.displayName = "DropdownSelect";
const DropdownSelect = React.forwardRef(DropdownSelectInner) as <T>(
  props: Props<T> & React.RefAttributes<DropdownSelectRef>
) => ReturnType<typeof DropdownSelectInner>;
export default DropdownSelect;

// handles the case when component has not mounted yet and `document` is not yet available
// https://github.com/tailwindlabs/headlessui/blob/fbaa1ae9da8788910ce8b240851f9779630babcb/packages/playground-react/pages/menu/menu-with-popper.tsx#L87-L95
const Portal: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return createPortal(children, document.body);
};
