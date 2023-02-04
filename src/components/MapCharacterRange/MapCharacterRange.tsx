import { useCallback } from "react";

import * as classes from "./styles.css";
import { normalizeRange } from "../../utils/character-range";

import type * as GameData from "../../gamedata-types";

interface Props {
  rangeObject: GameData.Range;
  direction: string;
}

const MapCharacterRange: React.FC<Props> = ({ rangeObject, direction }) => {
  const { operatorCoordinates, grid } = normalizeRange(rangeObject);
  const getDirectionInDegrees = useCallback(function (direction: string) {
    switch (direction) {
      case "north":
        return -90;
      case "south":
        return 90;
      case "west":
        return -180;
      default:
        return 0;
    }
  }, []);
  const skillStyle = {
    top: `${(2 + 64) * -operatorCoordinates.row}px`,
    left: `${(2 + 64) * -operatorCoordinates.col}px`,
    rotate: `${getDirectionInDegrees(direction)}deg`,
    transformOrigin: `calc(64px * ${operatorCoordinates.col + 1} + 2px * ${
      operatorCoordinates.col
    } - 32px) calc(64px * ${operatorCoordinates.row + 1} + 2px * ${
      operatorCoordinates.row
    } - 32px)`,
  };

  return (
    <div className={classes.skillContainer} style={skillStyle}>
      {grid.map((row, rowIndex) => {
        return (
          <div className={classes.skillRow} key={rowIndex}>
            {row.map((column, colIndex) => {
              return (
                <div
                  key={`range-${rowIndex}-${colIndex}`}
                  className={classes.cell[column as keyof typeof classes.cell]}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
export default MapCharacterRange;
