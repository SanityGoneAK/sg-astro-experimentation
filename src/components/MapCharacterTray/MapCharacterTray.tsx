import * as classes from "./styles.css";

import MapCharacter from "../MapCharacter";

import type * as OutputTypes from "../../output-types";

interface Props {
  characters: OutputTypes.DraggableCharacter[];
}

const MapCharacterTray: React.FC<Props> = ({ characters }) => {
  return (
    <div className={classes.tray}>
      {characters
        .filter((character) => character.row == null && character.col == null)
        .map((character) => {
          return (
            <MapCharacter
              key={character.charId}
              inMap={false}
              character={character.characterObject}
            ></MapCharacter>
          );
        })}
    </div>
  );
};
export default MapCharacterTray;
