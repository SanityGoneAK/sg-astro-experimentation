import { useCallback, useEffect, useState } from "react";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import operatorsJson from "../../../data/operators.json";
import {
  entitiesStore,
  operatorStore,
  tokensStore,
  retreatOperator,
  retreatToken,
  deployOperator,
  deployToken,
  setTokenDefaults,
  currentRouteStore,
  setActionDefaults,
  routesStore,
} from "../../pages/maps/_store";
import MapActionsTable from "../MapActionsTable";
import MapCharacter from "../MapCharacter";
import MapCharacterSearch from "../MapCharacterSearch";
import MapEnemyPanel from "../MapEnemyPanel";
import MapEntitiesTray from "../MapEntitiesTray";
import MapRouteViewer from "../MapRouteViewer";
import MapTile from "../MapTile";
import MapTileDefinitions from "../MapTileDefinitions";
import MapToken from "../MapToken";
import MapWaveDetails from "../MapWaveDetails";

import type * as OutputTypes from "../../output-types";

interface Props {
  stageData: OutputTypes.StageData;
}

const MapViewer: React.FC<Props> = ({ stageData }) => {
  const [tiles, setTiles] = useState(stageData.mapData.tiles);
  const [board, setBoard] = useState(stageData.mapData.map);

  const entities = useStore(entitiesStore);
  const route = useStore(currentRouteStore);

  useEffect(() => {
    setTokenDefaults(stageData);
    setActionDefaults(stageData.waves);
    routesStore.set(stageData.routes);
  }, [stageData]);

  const [movingPiece, setMovingPiece] = useState<
    OutputTypes.DraggableCharacter | OutputTypes.DraggableToken | null
  >(null);

  const checkCanDrop = useCallback(
    function checkCanDrop(
      moveToRow: number,
      moveToCol: number,
      movingPiece: OutputTypes.DraggableEntity
    ) {
      const tileIndex = board[moveToRow][moveToCol];
      const tile = tiles[tileIndex];

      const entityPosition = movingPiece.range;

      if (entityPosition == "MELEE" && tile.buildableType == 1) {
        return true;
      }

      if (entityPosition == "RANGED" && tile.buildableType == 2) {
        return true;
      }

      return false;
    },
    [board, tiles]
  );

  const setDraggableEntityCoordinates = useCallback(
    (charId: string, row: number | null, col: number | null) => {
      entities.forEach((entity) => {
        if (entity.type == "character" && entity.charId == charId) {
          deployOperator(entity, col, row);
        }
        if (entity.type == "token" && entity.tokenId == charId) {
          deployToken(entity, col, row);
        }
      });
    },
    [entities]
  );

  const removeEntityFromMap = useCallback(
    (charId: string) => {
      entities.forEach((entity) => {
        if (entity.type == "character" && entity.charId == charId) {
          retreatOperator(entity);
        }
        if (entity.type == "token" && entity.tokenId == charId) {
          setTiles(
            tiles.map((tile, index) => {
              if (
                entity.row != null &&
                entity.col != null &&
                index == board[entity.row][entity.col]
              ) {
                tile.passableMask = 3;
              }
              return tile;
            })
          );
          retreatToken(entity);
        }
      });
    },
    [board, entities, tiles]
  );

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const activeEntity = entities.find((entity) => {
        if (entity.type == "character" && entity.charId == event.active.id) {
          return true;
        }
        if (entity.type == "token" && entity.tokenId == event.active.id) {
          return true;
        }

        return false;
      });
      if (activeEntity) {
        setMovingPiece(activeEntity);
      }
    },
    [entities]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      if (!movingPiece) {
        return;
      }
      const entityId =
        movingPiece.type == "character"
          ? movingPiece.charId
          : movingPiece.tokenId;
      if (event.over == null) {
        setDraggableEntityCoordinates(entityId, null, null);
        setMovingPiece(null);
        return;
      }

      const [row, col] = event.over.id.toString().split("-").map(Number);

      const tileAlreadyHasCharacter = entities.some(
        (entity) => entity.row == row && entity.col == col
      );

      if (event.over && !tileAlreadyHasCharacter) {
        if (!checkCanDrop(row, col, movingPiece)) {
          return;
        }

        setDraggableEntityCoordinates(entityId, row, col);

        if (movingPiece.type == "token") {
          setTiles(
            tiles.map((tile, index) => {
              if (index == board[row][col]) {
                tile.passableMask = 2;
              }
              return tile;
            })
          );
        }
      }
      setMovingPiece(null);
    },
    [
      movingPiece,
      entities,
      setDraggableEntityCoordinates,
      checkCanDrop,
      tiles,
      board,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setMovingPiece(null);
  }, []);

  const handleOperatorSelected = useCallback((operatorId: string) => {
    // setOperatorIds((old) => [...new Set(old), operatorId]);
  }, []);

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        modifiers={[snapCenterToCursor]}
      >
        <div className={classes.container}>
          {route && (
            <MapRouteViewer tiles={tiles} board={board} route={route} />
          )}
          <MapTileDefinitions />
          {board.map((row, rowIndex) => {
            return (
              <div className={classes.row} key={`row-${rowIndex}`}>
                {row.map((rowTile, tileIndex) => {
                  const tile = tiles[rowTile];
                  const entity = entities.find(
                    (entity) =>
                      entity.row == rowIndex && entity.col == tileIndex
                  );
                  const canDrop = movingPiece
                    ? checkCanDrop(rowIndex, tileIndex, movingPiece)
                    : false;
                  return (
                    <MapTile
                      key={`tile-${rowIndex}-${tileIndex}`}
                      tileType={tile.tileKey}
                      validDropLocation={canDrop}
                      rowIndex={rowIndex}
                      tileIndex={tileIndex}
                    >
                      {entity?.type == "character" && (
                        <MapCharacter
                          removeCharacter={removeEntityFromMap}
                          key={entity.charId}
                          inMap={true}
                          character={entity}
                        ></MapCharacter>
                      )}
                      {entity?.type == "token" && (
                        <MapToken
                          removeToken={removeEntityFromMap}
                          key={entity.tokenId}
                          inMap={true}
                          token={entity}
                        ></MapToken>
                      )}
                    </MapTile>
                  );
                })}
              </div>
            );
          })}

          <MapEntitiesTray />
        </div>
        {/* <MapCharacterSearch /> */}
        <MapWaveDetails />
        <MapEnemyPanel mapEnemy={stageData.enemyDbRefs} />
        <MapActionsTable />
      </DndContext>
    </>
  );
};
export default MapViewer;
