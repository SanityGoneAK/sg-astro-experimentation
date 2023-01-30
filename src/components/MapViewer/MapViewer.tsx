import { useCallback, useState } from "react";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import * as classes from "./styles.css";
import operatorsJson from "../../../data/operators.json";
import MapCharacter from "../MapCharacter";
import MapCharacterTray from "../MapCharacterTray";
import MapTile from "../MapTile";

import type * as OutputTypes from "../../output-types";

interface Props {
  stageData: OutputTypes.StageData;
}

const MapViewer: React.FC<Props> = ({ stageData }) => {
  const tiles = stageData.mapData.tiles;
  const board = stageData.mapData.map;

  const [characters, setCharacters] = useState(() => getCharacters());
  const [movingPiece, setMovingPiece] =
    useState<OutputTypes.DraggableCharacter | null>(null);

  const getSvgDefs = (
    <svg
      className="visually-hidden"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <rect
          x="2"
          y="2"
          id="tile_start"
          width="60"
          height="60"
          stroke="#F45C5C"
          strokeWidth="4"
        />
        <g id="tile_start_drone">
          <rect
            x="2"
            y="2.00002"
            width="60"
            height="60"
            stroke="#F45C5C"
            strokeWidth="4"
          />
          <circle
            cx="23.5"
            cy="23.5"
            r="5.5"
            stroke="#F45C5C"
            strokeWidth="4"
          />
          <circle
            cx="40.5"
            cy="23.5"
            r="5.5"
            stroke="#F45C5C"
            strokeWidth="4"
          />
          <circle
            cx="23.5"
            cy="40.5"
            r="5.5"
            stroke="#F45C5C"
            strokeWidth="4"
          />
          <circle
            cx="40.5"
            cy="40.5"
            r="5.5"
            stroke="#F45C5C"
            strokeWidth="4"
          />
          <rect
            x="28.3685"
            y="25.5401"
            width="14.7833"
            height="4"
            transform="rotate(45 28.3685 25.5401)"
            fill="#F45C5C"
          />
          <rect
            x="38.4546"
            y="28.6875"
            width="15.227"
            height="4"
            transform="rotate(135 38.4546 28.6875)"
            fill="#F45C5C"
          />
          <rect
            x="36"
            y="28"
            width="8"
            height="8"
            transform="rotate(90 36 28)"
            fill="#F45C5C"
          />
        </g>
        <rect
          x="2"
          y="2"
          id="tile_end"
          width="60"
          height="60"
          stroke="#49B3FF"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          id="tile_floor"
          width="60"
          height="60"
          fill="#191920"
          stroke="#24242E"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          id="tile_forbidden"
          width="60"
          height="60"
          fill="#101014"
          stroke="#24242E"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          id="tile_road"
          width="60"
          height="60"
          fill="#363643"
          stroke="#484858"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          id="tile_road"
          width="60"
          height="60"
          fill="#363643"
          stroke="#484858"
          strokeWidth="4"
        />
        <rect
          x="2"
          y="2"
          id="tile_wall"
          width="60"
          height="60"
          fill="#87879B"
          stroke="#484858"
          strokeWidth="4"
        />
      </defs>
    </svg>
  );
  const checkCanDrop = useCallback(
    function checkCanDrop(
      moveToRow: number,
      moveToCol: number,
      movingPiece: OutputTypes.DraggableCharacter
    ) {
      const tileIndex = board[moveToRow][moveToCol];
      const tile = tiles[tileIndex];

      const characterPosition = movingPiece.characterObject.position;

      if (characterPosition == "MELEE" && tile.buildableType == 1) {
        return true;
      }

      if (characterPosition == "RANGED" && tile.buildableType == 2) {
        return true;
      }

      return false;
    },
    [board, tiles]
  );

  function getCharacters() {
    const testOp = operatorsJson[
      "char_102_texas" as keyof typeof operatorsJson
    ] as OutputTypes.Character;

    return [
      {
        row: null,
        col: null,
        charId: testOp.charId,
        characterObject: testOp,
      },
    ] as OutputTypes.DraggableCharacter[];
  }
  const setCharacterCoordiantes = useCallback(
    function setCharacterCoordiantes(
      charId: string,
      row: number | null,
      col: number | null
    ) {
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

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const activeCharacter = characters.find(
        (character) => character.charId == event.active.id
      );
      if (activeCharacter) {
        setMovingPiece(activeCharacter);
      }
    },
    [characters]
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

      const tileAlreadyHasCharacter = characters.some(
        (character) => character.row == row && character.col == col
      );

      if (event.over && !tileAlreadyHasCharacter) {
        if (!checkCanDrop(row, col, movingPiece)) {
          return;
        }

        setCharacterCoordiantes(movingPiece.charId, row, col);
      }
      setMovingPiece(null);
    },
    [movingPiece, characters, checkCanDrop, setCharacterCoordiantes]
  );

  const handleDragCancel = useCallback(() => {
    setMovingPiece(null);
  }, []);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      modifiers={[snapCenterToCursor]}
    >
      <div className={classes.container}>
        {getSvgDefs}
        {board.map((row, rowIndex) => {
          return (
            <div className={classes.row} key={`row-${rowIndex}`}>
              {row.map((rowTile, tileIndex) => {
                const tile = tiles[rowTile];
                const character = characters.find(
                  (character) =>
                    character.row == rowIndex && character.col == tileIndex
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
                        key={character.charId}
                        inMap={true}
                        character={character.characterObject}
                      ></MapCharacter>
                    )}
                  </MapTile>
                );
              })}
            </div>
          );
        })}

        <MapCharacterTray characters={characters} />
      </div>
    </DndContext>
  );
};
export default MapViewer;
