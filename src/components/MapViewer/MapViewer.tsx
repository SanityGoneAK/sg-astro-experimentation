import { useCallback, useEffect, useState } from "react";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import operatorsJson from "../../../data/operators.json";
import { getStatsAtLevel } from "../../utils/character-stats";
import MapCharacter from "../MapCharacter";
import MapEntitiesTray from "../MapEntitiesTray";
import MapTile from "../MapTile";
import {
  entitiesStore,
  operatorStore,
  tokensStore,
  retreatOperator,
  retreatToken,
  deployOperator,
  deployToken,
} from "../../pages/maps/_store";

import MapWaveManager from "../MapWaveManager";
import type * as OutputTypes from "../../output-types";
import MapRouteViewer from "../MapRouteViewer";
import MapTileDefinitions from "../MapTileDefinitions";
import MapToken from "../MapToken";
import MapCharacterSearch from "../MapCharacterSearch";

interface Props {
  stageData: OutputTypes.StageData;
}

const MapViewer: React.FC<Props> = ({ stageData }) => {
  const [tiles, setTiles] = useState(stageData.mapData.tiles);
  const [board, setBoard] = useState(stageData.mapData.map);

  const entities = useStore(entitiesStore);

  // const getDefaultTokens = useCallback(() => {
  //   const rangeMapping = {
  //     trap_001_crate: "MELEE",
  //   };
  //   const tokens: OutputTypes.DraggableToken[] = [];
  //   stageData.predefines.tokenCards.forEach((token) => {
  //     for (let index = 1; index < token.initialCnt; index++) {
  //       tokens.push({
  //         row: null,
  //         col: null,
  //         charId: token.inst.characterKey,
  //         tokenId: token.inst.characterKey + "-" + index,
  //         type: "token",
  //         tokeObject: token,
  //         range: rangeMapping[
  //           token.inst.characterKey as keyof typeof rangeMapping
  //         ] as "MELEE" | "RANGED",
  //       });
  //     }
  //   });

  //   return tokens;
  // }, [stageData.predefines.tokenCards]);

  // useEffect(() => {
  //   tokensStore.set(getDefaultTokens());
  // }, []);

  // uncomment this once ready
  // const entities = useStore(entitiesStore);
  // const [operatorIds, setOperatorIds] = useState<string[]>(["char_197_poca"]);
  // const getDraggableEntities = useCallback(() => {
  //   const rangeMapping = {
  //     trap_001_crate: "MELEE",
  //   };
  //   const entities = [] as Array<
  //     OutputTypes.DraggableToken | OutputTypes.DraggableCharacter
  //   >;

  //   operatorIds.forEach((opId) => {
  //     const operator = operatorsJson[
  //       opId as keyof typeof operatorsJson
  //     ] as OutputTypes.Character;
  //     entities.push({
  //       row: null,
  //       col: null,
  //       charId: opId,
  //       range: operator.position,
  //       type: "character",
  //       stats: getStatsAtLevel(operator, {
  //         eliteLevel: 2,
  //         level: 80,
  //         pots: false,
  //         trust: false,
  //       }),
  //       characterObject: operator,
  //     });
  //   });

  //   stageData.predefines.tokenCards.forEach((token) => {
  //     for (let index = 1; index < token.initialCnt; index++) {
  //       entities.push({
  //         row: null,
  //         col: null,
  //         charId: token.inst.characterKey,
  //         tokenId: token.inst.characterKey + "-" + index,
  //         type: "token",
  //         tokeObject: token,
  //         range: rangeMapping[
  //           token.inst.characterKey as keyof typeof rangeMapping
  //         ] as "MELEE" | "RANGED",
  //       });
  //     }
  //   });
  //   return entities;
  // }, [operatorIds, stageData.predefines.tokenCards]);

  // const [entities, setEntity] = useState(() => getDraggableEntities());
  const [route, setRoute] = useState<OutputTypes.Route | null>(null);
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
        <MapWaveManager
          waves={stageData.waves}
          routes={stageData.routes}
          setRoute={setRoute}
        />
      </DndContext>
    </>
  );
};
export default MapViewer;
