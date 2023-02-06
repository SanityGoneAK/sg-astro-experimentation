import { useCallback, useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import MapCharacterDirectionSelector from "../MapCharacterDirectionSelector";
import MapCharacterRange from "../MapCharacterRange";
import type * as OutputTypes from "../../output-types";

import * as classes from "./styles.css";
import { summonImage, tokenImage } from "../../utils/images";

interface Props {
  token: OutputTypes.DraggableToken;
  inMap: boolean;
  removeToken: (tokenId: string) => void;
}

const MapToken: React.FC<Props> = ({ token, inMap, removeToken }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: token.tokenId,
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
      {/* {inMap && !direction && (
        <MapCharacterDirectionSelector setDirection={setDirection} />
      )} */}
      {!inMap && (
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className={classes.operatorPortrait.selector}
        >
          <img src={tokenImage(token.charId)} width="64" height="64" />
        </div>
      )}
      {inMap && (
        <>
          {active && (
            <div className={classes.menuSelector}>
              <button
                className={classes.removeCharacter}
                onClick={() => removeToken(token.tokenId)}
              >
                Remove
              </button>
            </div>
          )}
          {/* TODO: Figure out token range objects */}
          {/* {active && (
            <MapCharacterRange
              rangeObject={character.stats.rangeObject}
              direction={direction}
            />
          )} */}
          <div className={classes.operatorPortrait.map} onClick={openMenu}>
            {direction && (
              <div
                className={
                  classes.direction[direction as keyof typeof classes.direction]
                }
              ></div>
            )}

            <img src={tokenImage(token.charId)} width="64" height="64" />
          </div>
        </>
      )}
    </>
  );
};
export default MapToken;
