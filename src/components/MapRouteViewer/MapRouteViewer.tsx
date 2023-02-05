import { useCallback, useMemo } from "react";
import { Grid, BestFirstFinder, Heuristic } from "pathfinding";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  route: OutputTypes.Route;
  tiles: OutputTypes.Tile[];
  board: number[][];
}

const MapRouteViewer: React.FC<Props> = ({ route, board, tiles }) => {
  const grid = useMemo(
    function () {
      const mapMatrix = board
        .map((row) => {
          return row.map((column) => {
            const tile = tiles[column];
            // 0 means walkable, 1 means blocked
            return tile.passableMask > 2 ? 0 : 1;
          });
        })
        // instead of starting on the top left corner of the map, it should start from the bottom left corner
        .reverse();
      return new Grid(mapMatrix);
    },
    [board, tiles]
  );

  const getSvgPath = useCallback(function (path: any) {
    let i;
    const strs = [];
    const size = 64;

    strs.push(
      "M" +
        (path[0][0] * size + size / 2) +
        " " +
        (path[0][1] * size + size / 2)
    );
    for (i = 1; i < path.length; ++i) {
      strs.push(
        "L" +
          (path[i][0] * size + size / 2) +
          " " +
          (path[i][1] * size + size / 2)
      );
    }

    return strs.join("");
  }, []);

  const flattenedRoute = useMemo(
    function () {
      return [
        route.startPosition,
        ...route.checkpoints.map((checkpoint) => {
          return {
            row: checkpoint.position.row,
            col: checkpoint.position.col,
            time: checkpoint.time,
            type: checkpoint.type,
          };
        }),
        route.endPosition,
      ];
    },
    [route.checkpoints, route.endPosition, route.startPosition]
  );

  const path = useMemo(
    function () {
      const fullPath = [];
      const finder = new BestFirstFinder({
        allowDiagonal: route.allowDiagonalMove,
        heuristic: Heuristic.euclidean,
      });

      for (let index = 0; index < flattenedRoute.length - 1; index++) {
        const startPoint = flattenedRoute[index];
        const endPoint = flattenedRoute[index + 1];

        fullPath.push(
          ...finder.findPath(
            startPoint.col,
            startPoint.row,
            endPoint.col,
            endPoint.row,
            grid.clone()
          )
        );
      }

      return fullPath;
    },
    [flattenedRoute, grid, route.allowDiagonalMove]
  );

  return (
    <div className={classes.container}>
      <svg
        className={classes.root}
        width={grid.width * 64 + (grid.width - 1) * 2}
        height={grid.height * 64 + (grid.height - 1) * 2}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path.length && (
          <path d={getSvgPath(path)} stroke="#F45C5C" strokeWidth={5} />
        )}
      </svg>
    </div>
  );
};
export default MapRouteViewer;
