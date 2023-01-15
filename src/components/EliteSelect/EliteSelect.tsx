import React from "react";

import { EliteZeroIcon, EliteOneIcon, EliteTwoIcon } from "../icons";
import * as classes from "./styles.css";

interface Props {
  maxElite: number;
  currentElite: number;
  onChange: (newElite: number) => void;
}

const EliteSelect: React.FC<Props> = ({ maxElite, currentElite, onChange }) => {
  return (
    <div className={classes.root}>
      Promotion
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
export default EliteSelect;

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
