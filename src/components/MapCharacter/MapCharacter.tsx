import type { Character } from "../../output-types";
import { operatorAvatar } from "../../utils/images";
import { useDraggable } from "@dnd-kit/core";

import * as classes from "./styles.css";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import MapCharacterDirectionSelector from "../MapCharacterDirectionSelector";

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
        <div>
          <MapCharacterDirectionSelector setDirection={setDirection} />
        </div>
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={classes.base}
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
