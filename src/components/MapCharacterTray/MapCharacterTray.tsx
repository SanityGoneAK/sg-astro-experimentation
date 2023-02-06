import * as classes from "./styles.css";

import MapCharacter from "../MapCharacter";

import type * as OutputTypes from "../../output-types";
import MapToken from "../MapToken";

interface Props {
  characters: OutputTypes.DraggableCharacter[];
  tokens: OutputTypes.DraggableToken[];
}

const MapCharacterTray: React.FC<Props> = ({ characters, tokens }) => {
  return (
    <div className={classes.tray}>
      {characters
        .filter((character) => character.row == null && character.col == null)
        .map((character) => {
          return (
            <MapCharacter
              key={character.charId}
              inMap={false}
              character={character}
            ></MapCharacter>
          );
        })}
      {tokens
        .filter((token) => token.row == null && token.col == null)
        .map((token) => {
          return (
            <MapToken
              key={token.tokenId}
              inMap={false}
              token={token}
            ></MapToken>
          );
        })}
    </div>
  );
};
export default MapCharacterTray;
