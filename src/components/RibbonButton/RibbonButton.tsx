import cx from "clsx";

import * as classes from "./styles.css";

type Props = React.PropsWithChildren<
  React.HTMLAttributes<HTMLButtonElement>
> & {
  active?: boolean;
};

const RibbonButton: React.FC<Props> = ({
  children,
  className,
  active,
  ...rest
}) => {
  return (
    <button
      className={cx(classes.root, className, active && classes.active)}
      aria-current={active ? "true" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
};

export default RibbonButton;
