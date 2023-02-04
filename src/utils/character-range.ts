import type * as GameData from "../gamedata-types";

enum GridCell {
  Operator = "operator",
  empty = "empty",
  active = "active",
}

interface NormalizedRange {
  rows: number;
  cols: number;
  operatorCoordinates: {
    row: number;
    col: number;
  };
  grid: GridCell[][];
}

export const normalizeRange = (
  rangeObject: GameData.Range
): NormalizedRange => {
  const rangeGrids = [...rangeObject.grids, { row: 0, col: 0 }];
  // for each of rows and cols,
  // find the minimum value and the maximum value
  // then return max-min to get number of rows/cols
  const rowIndices = rangeGrids.map((cell) => cell.row);
  const colIndices = rangeGrids.map((cell) => cell.col);
  const minRowIndex = Math.min(...rowIndices);
  const maxRowIndex = Math.max(...rowIndices);
  const minColIndex = Math.min(...colIndices);
  const maxColIndex = Math.max(...colIndices);

  const operatorCoordinates = {
    row: 0,
    col: 0,
  };

  // create a 2d-array of size [rows, cols]
  const rows = maxRowIndex - minRowIndex + 1;
  const cols = maxColIndex - minColIndex + 1;
  const grid = Array<GridCell>(rows)
    .fill(GridCell.empty)
    .map(() => Array<GridCell>(cols).fill(GridCell.empty));
  rangeGrids.forEach((cell) => {
    const type =
      cell.row === 0 && cell.col === 0 ? GridCell.Operator : GridCell.active;
    if (type == GridCell.Operator) {
      operatorCoordinates.row = cell.row - minRowIndex;
      operatorCoordinates.col = cell.col - minColIndex;
    }
    grid[cell.row - minRowIndex][cell.col - minColIndex] = type;
  });
  return {
    operatorCoordinates,
    rows,
    cols,
    grid,
  };
};
