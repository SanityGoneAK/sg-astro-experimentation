import { useCallback, useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import * as classes from "./styles.css";
import { retreatOperator } from "../../pages/maps/_store";
import { operatorAvatar } from "../../utils/images";
import MapCharacterDirectionSelector from "../MapCharacterDirectionSelector";
import MapCharacterRange from "../MapCharacterRange";

import type { DraggableCharacter } from "../../output-types";

interface Props {
  character: DraggableCharacter;
  inMap: boolean;
}

const MapCharacter: React.FC<Props> = ({ character, inMap }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: character.charId,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const [direction, setDirection] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);

  const openMenu = useCallback(function () {
    setActive(true);
  }, []);

  return (
    <>
      {inMap && !direction && (
        <MapCharacterDirectionSelector setDirection={setDirection} />
      )}
      {!inMap && (
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className={classes.operatorPortrait.selector}
        >
          <img src={operatorAvatar(character.charId)} width="64" height="64" />
        </div>
      )}
      {inMap && (
        <>
          {active && (
            <div className={classes.menuSelector}>
              <button
                className={classes.removeCharacter}
                onClick={() => retreatOperator(character)}
              >
                Remove
              </button>
            </div>
          )}
          {
            <MapCharacterRange
              rangeObject={character.stats.rangeObject}
              direction={direction}
            />
          }
          <div className={classes.operatorPortrait.map} onClick={openMenu}>
            {direction && (
              <div
                className={
                  classes.direction[direction as keyof typeof classes.direction]
                }
              ></div>
            )}

            <img
              src={operatorAvatar(character.charId)}
              width="64"
              height="64"
            />
          </div>
        </>
      )}
    </>
  );
};
export default MapCharacter;
