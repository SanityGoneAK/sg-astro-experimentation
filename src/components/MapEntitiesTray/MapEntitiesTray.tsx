import * as classes from "./styles.css";

import MapCharacter from "../MapCharacter";

import type * as OutputTypes from "../../output-types";
import MapToken from "../MapToken";

interface Props {
  entities: Array<OutputTypes.DraggableToken | OutputTypes.DraggableCharacter>;
}

const MapEntitiesTray: React.FC<Props> = ({ entities }) => {
  return (
    <div className={classes.tray}>
      {entities
        .filter((entity) => entity.row == null && entity.col == null)
        .map((entity) => {
          if (entity.type == "character") {
            return (
              <MapCharacter
                key={entity.charId}
                inMap={false}
                character={entity}
              ></MapCharacter>
            );
          }
          if (entity.type == "token") {
            return (
              <MapToken
                key={entity.tokenId}
                inMap={false}
                token={entity}
              ></MapToken>
            );
          }
        })}
    </div>
  );
};
export default MapEntitiesTray;
