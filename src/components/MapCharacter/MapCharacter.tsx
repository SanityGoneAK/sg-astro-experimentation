import { useCallback, useEffect, useRef, useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import * as classes from "./styles.css";
import { retreatOperator } from "../../pages/maps/_store";
import { operatorAvatar, skillIcon } from "../../utils/images";
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
  const [skillActive, setSkillActive] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(function () {
    setActive(true);
    menuRef.current?.focus();
  }, []);
  const closeMenu = useCallback(function () {
    requestAnimationFrame(() => {
      console.log(document.activeElement);
      if (!menuRef.current?.contains(document.activeElement)) {
        setActive(false);
      }
    });
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
          <div
            className={active ? classes.menuSelector : "visually-hidden"}
            ref={menuRef}
            tabIndex={0}
            onBlur={closeMenu}
          >
            <div className={classes.selectorRing}></div>
            <button
              className={classes.removeCharacter}
              onClick={() => retreatOperator(character)}
            >
              <img
                src="https://map.ark-nights.com/assets/escape.png"
                alt="retreat operator"
              />
            </button>
            <button
              className={classes.skill}
              onClick={() => setSkillActive(!skillActive)}
            >
              <img
                src={skillIcon(character.skill.iconId, character.skill.skillId)}
                alt={`${character.charId}-skill`}
              />
            </button>
          </div>
          <MapCharacterRange
            rangeObject={
              skillActive
                ? character.skill.levels[6].range
                : character.stats.rangeObject
            }
            direction={direction}
          />
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
