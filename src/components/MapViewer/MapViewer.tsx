import { useCallback, useState } from "react";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import * as classes from "./styles.css";
import operatorsJson from "../../../data/operators.json";
import { getStatsAtLevel } from "../../utils/character-stats";
import MapCharacter from "../MapCharacter";
import MapCharacterTray from "../MapCharacterTray";
import MapTile from "../MapTile";

import MapWaveManager from "../MapWaveManager";
import type * as OutputTypes from "../../output-types";
import MapRouteViewer from "../MapRouteViewer";
import MapTileDefinitions from "../MapTileDefinitions";
import MapToken from "../MapToken";

interface Props {
  stageData: OutputTypes.StageData;
}

const MapViewer: React.FC<Props> = ({ stageData }) => {
  const [tiles, setTiles] = useState(stageData.mapData.tiles);
  const [board, setBoard] = useState(stageData.mapData.map);

  const getCharacters = useCallback(function getCharacters() {
    const testOp = operatorsJson[
      "char_197_poca" as keyof typeof operatorsJson
    ] as OutputTypes.Character;

    return [
      {
        row: null,
        col: null,
        charId: testOp.charId,
        range: testOp.position,
        type: "character",
        stats: getStatsAtLevel(testOp, {
          eliteLevel: 2,
          level: 80,
          pots: false,
          trust: false,
        }),
        characterObject: testOp,
      },
    ] as OutputTypes.DraggableCharacter[];
  }, []);

  const getTokens = useCallback(
    function () {
      const rangeMapping = {
        trap_001_crate: "MELEE",
      };
      const tokens = [] as OutputTypes.DraggableToken[];

      stageData.predefines.tokenCards.forEach((token) => {
        for (let index = 1; index < token.initialCnt; index++) {
          tokens.push({
            row: null,
            col: null,
            charId: token.inst.characterKey,
            tokenId: token.inst.characterKey + "-" + index,
            type: "token",
            tokeObject: token,
            range: rangeMapping[
              token.inst.characterKey as keyof typeof rangeMapping
            ] as "MELEE" | "RANGED",
          });
        }
      });

      return tokens;
    },
    [stageData.predefines.tokenCards]
  );

  const [characters, setCharacters] = useState(() => getCharacters());
  const [tokens, setTokens] = useState(() => getTokens());
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

  const setCharacterCoordiantes = useCallback(
    function (charId: string, row: number | null, col: number | null) {
      const transformedCharacters = characters.map((character) => {
        if (character.charId == charId) {
          character.row = row;
          character.col = col;
        }
        return character;
      });

      setCharacters(transformedCharacters);
    },
    [characters]
  );

  const setTokenCoordinates = useCallback(
    function (tokenId: string, row: number | null, col: number | null) {
      const transformedTokens = tokens.map((token) => {
        if (token.tokenId == tokenId) {
          token.row = row;
          token.col = col;
        }
        return token;
      });

      setTokens(transformedTokens);
    },
    [tokens]
  );

  const removeCharacterFromMap = useCallback(
    function (charId: string) {
      const updatedCharacters = characters.map((character) => {
        if (character.charId == charId) {
          character.row = null;
          character.col = null;
        }
        return character;
      });
      setCharacters(updatedCharacters);
    },
    [characters]
  );

  const removeTokenFromMap = useCallback(
    function (tokenId: string) {
      const updatedToken = tokens.map((token) => {
        if (
          token.tokenId == tokenId &&
          token.row != null &&
          token.col != null
        ) {
          setTiles(
            tiles.map((tile, index) => {
              if (index == board[token.row][token.col]) {
                tile.passableMask = 3;
              }
              return tile;
            })
          );
          token.row = null;
          token.col = null;
        }
        return token;
      });
      setTokens(updatedToken);
    },
    [board, tiles, tokens]
  );

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const activeCharacter = characters.find(
        (character) => character.charId == event.active.id
      );
      const activeToken = tokens.find(
        (token) => token.tokenId == event.active.id
      );
      if (activeCharacter) {
        setMovingPiece(activeCharacter);
      }
      if (activeToken) {
        setMovingPiece(activeToken);
      }
    },
    [characters, tokens]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      if (!movingPiece) {
        return;
      }
      if (event.over == null) {
        setCharacterCoordiantes(movingPiece.charId, null, null);
        setMovingPiece(null);
        return;
      }

      const [row, col] = event.over.id.toString().split("-").map(Number);

      const tileAlreadyHasCharacter =
        characters.some(
          (character) => character.row == row && character.col == col
        ) || tokens.some((token) => token.row == row && token.col == col);

      if (event.over && !tileAlreadyHasCharacter) {
        if (!checkCanDrop(row, col, movingPiece)) {
          return;
        }

        if (movingPiece.type == "character") {
          setCharacterCoordiantes(movingPiece.charId, row, col);
        }

        if (movingPiece.type == "token") {
          setTiles(
            tiles.map((tile, index) => {
              if (index == board[row][col]) {
                tile.passableMask = 2;
              }
              return tile;
            })
          );
          console.log(tiles, board[row][col]);
          setTokenCoordinates(movingPiece.tokenId, row, col);
        }
      }
      setMovingPiece(null);
    },
    [
      movingPiece,
      characters,
      tokens,
      setCharacterCoordiantes,
      checkCanDrop,
      tiles,
      board,
      setTokenCoordinates,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setMovingPiece(null);
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
                  const character = characters.find(
                    (character) =>
                      character.row == rowIndex && character.col == tileIndex
                  );
                  const token = tokens.find(
                    (token) => token.row == rowIndex && token.col == tileIndex
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
                      {character && (
                        <MapCharacter
                          removeCharacter={removeCharacterFromMap}
                          key={character.charId}
                          inMap={true}
                          character={character}
                        ></MapCharacter>
                      )}
                      {token && (
                        <MapToken
                          removeToken={removeTokenFromMap}
                          key={token.tokenId}
                          inMap={true}
                          token={token}
                        ></MapToken>
                      )}
                    </MapTile>
                  );
                })}
              </div>
            );
          })}

          <MapCharacterTray characters={characters} tokens={tokens} />
        </div>
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
