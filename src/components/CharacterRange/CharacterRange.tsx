import * as classes from "./styles.css";

import type * as GameData from "../../gamedata-types";
import { normalizeRange } from "../../utils/character-range";

export interface CharacterRangeProps {
  rangeObject: GameData.Range;
}

// FIXME due to some visually hidden styles the table is slightly too large
// I still need to figure out how to compensate for it
const CharacterRange: React.FC<
  CharacterRangeProps & React.HTMLAttributes<HTMLTableElement>
> = (props) => {
  const { rangeObject, ...rest } = props;
  const { rows, cols, grid } = normalizeRange(rangeObject);
  console.log(rows, cols, grid);
  return (
    <table className={classes.rangeTable} {...rest}>
      <thead>
        <tr>
          <th></th>
          {[...Array(cols).keys()].map((i) => (
            <th key={i} scope="col" className="visually-hidden">{`Y${
              i + 1
            }`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows).keys()].map((rowIndex) => (
          <tr key={rowIndex}>
            <th scope="row" className="visually-hidden">{`X${
              rowIndex + 1
            }`}</th>
            {[...Array(cols).keys()].map((colIndex) => (
              <td
                key={colIndex}
                className={`${classes.rangeCell} ${grid[rowIndex][colIndex]}`}
              >
                <span className="visually-hidden">{`${grid[rowIndex][colIndex]} cell`}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default CharacterRange;
