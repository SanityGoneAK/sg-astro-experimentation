import React from "react";

import * as classes from "./styles.css";
import { EliteZeroIcon, EliteOneIcon, EliteTwoIcon } from "../icons";

interface Props {
  maxElite: number;
  currentElite: number;
  onChange: (newElite: number) => void;
}

const EliteButtonGroup: React.FC<Props> = ({
  maxElite,
  currentElite,
  onChange,
}) => {
  return (
    <div className={classes.root}>
      <span className={classes.label}>Promotion</span>
      <div role="group" className={classes.buttonGroup}>
        {Array(maxElite + 1)
          .fill(0)
          .map((_, i) => (
            <EliteButton
              key={i}
              elite={i}
              active={i === currentElite}
              onClick={onChange}
            />
          ))}
      </div>
    </div>
  );
};
export default EliteButtonGroup;

const EliteButton: React.FC<{
  elite: number;
  active?: boolean;
  onClick: (newElite: number) => void;
}> = ({ elite, active, onClick }) => {
  let icon = null;
  switch (elite) {
    case 0:
      icon = EliteZeroIcon;
      break;
    case 1:
      icon = EliteOneIcon;
      break;
    case 2:
      icon = EliteTwoIcon;
      break;
  }
  if (!icon) {
    return null;
  }

  return (
    <button
      className={classes.eliteButton[elite === 0 ? "zero" : "oneTwo"]}
      onClick={() => onClick(elite)}
      aria-pressed={active}
      aria-label={`Elite ${elite}`}
    >
      {React.createElement(icon, {
        active,
      })}
    </button>
  );
};
