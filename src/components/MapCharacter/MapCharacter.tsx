import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import * as classes from "./styles.css";
import { operatorAvatar } from "../../utils/images";
import MapCharacterDirectionSelector from "../MapCharacterDirectionSelector";

import type { Character } from "../../output-types";

interface Props {
  character: Character;
  inMap: boolean;
}

const MapCharacter: React.FC<Props> = ({ character, inMap }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: character.charId,
  });
  const [direction, setDirection] = useState<string | null>(null);

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      {inMap && !direction && (
        <MapCharacterDirectionSelector setDirection={setDirection} />
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={
          inMap
            ? classes.operatorPortrait.map
            : classes.operatorPortrait.selector
        }
      >
        <div
          className={
            classes.direction[direction as keyof typeof classes.direction]
          }
        ></div>
        <img src={operatorAvatar(character.charId)} width="64" height="64" />
      </div>
    </>
  );
};
export default MapCharacter;
