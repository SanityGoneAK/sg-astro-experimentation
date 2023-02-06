import { useCallback, useMemo } from "react";
import { Grid, BestFirstFinder, Heuristic } from "pathfinding";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  route: OutputTypes.Route;
  tiles: OutputTypes.Tile[];
  board: number[][];
}

interface FlatCoordinates extends OutputTypes.MapCoordinates {
  time?: number;
  type?: number;
}

const MapRouteViewer: React.FC<Props> = ({ route, board, tiles }) => {
  const grid = useMemo(
    function () {
      const mapMatrix = board.map((row) => {
        return row.map((column) => {
          const tile = tiles[column];
          // 0 means walkable, 1 means blocked
          if (route.motionMode == 0) {
            return tile.passableMask > 2 ? 0 : 1;
          }

          //If motion mode is 1 then it's a drone
          return tile.passableMask >= 2 ? 0 : 1;
        });
      });
      return new Grid(mapMatrix);
    },
    [board, route.motionMode, tiles]
  );

  const getSvgPath = useCallback(function (path: any) {
    let i;
    const strs = [];
    const size = 66;

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
    function (): FlatCoordinates[] {
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
      ].map((route) => {
        return { ...route, row: grid.height - 1 - route.row };
      });
    },
    [grid.height, route.checkpoints, route.endPosition, route.startPosition]
  );

  const path = useMemo(
    function () {
      const routes = flattenedRoute.filter((route) => route?.type != 1);
      console.log(routes);

      if (route.motionMode == 1) {
        return routes.map((route) => {
          return [route.col, route.row];
        });
      }

      const fullPath = [];
      const finder = new BestFirstFinder({
        allowDiagonal: route.allowDiagonalMove,
        dontCrossCorners: true,
        heuristic: Heuristic.euclidean,
      });
      for (let index = 0; index < routes.length - 1; index++) {
        const startPoint = routes[index];
        const endPoint = routes[index + 1];

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
    [flattenedRoute, grid, route.allowDiagonalMove, route.motionMode]
  );

  return (
    <div className={classes.container}>
      <svg
        // className={classes.root}
        width={grid.width * 64 + (grid.width - 1) * 2}
        height={grid.height * 64 + (grid.height - 1) * 2}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path.length && (
          <path
            d={getSvgPath(path)}
            stroke="#F45C5C"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {flattenedRoute.map((route, routeIndex) => {
          if (route?.type == 1) {
            return;
          }

          if (flattenedRoute[routeIndex + 1]?.type == 1) {
            return (
              <g key={routeIndex}>
                <circle
                  cx={route.col * 66 + 66 / 2}
                  cy={route.row * 66 + 66 / 2}
                  stroke="#F45C5C"
                  strokeWidth="4"
                  fill="#191920"
                  r="16"
                ></circle>
                <text
                  fontSize="14px"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#E8E8F2"
                  x={route.col * 66 + 66 / 2}
                  y={route.row * 66 + 66 / 2}
                >
                  {flattenedRoute[routeIndex + 1].time}s
                </text>
              </g>
            );
          }

          return (
            <circle
              key={routeIndex}
              cx={route.col * 66 + 66 / 2}
              cy={route.row * 66 + 66 / 2}
              fill="#F45C5C"
              r="6"
            ></circle>
          );
        })}
      </svg>
    </div>
  );
};
export default MapRouteViewer;
