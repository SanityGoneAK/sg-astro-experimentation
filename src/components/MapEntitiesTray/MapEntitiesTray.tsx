import * as classes from "./styles.css";
import MapCharacter from "../MapCharacter";
import MapToken from "../MapToken";

import type * as OutputTypes from "../../output-types";

interface Props {
  entities: Array<OutputTypes.DraggableToken | OutputTypes.DraggableCharacter>;
}

const MapEntitiesTray: React.FC<Props> = ({ entities }) => {
  const availableEntities = entities.filter(
    (entity) => entity.row == null && entity.col == null
  );

  const tokensByCharId = availableEntities
    .filter((entity) => entity.type == "token")
    .reduce((acc, curr) => {
      acc.set(curr.charId, [...(acc.get(curr.charId) ?? []), curr]);
      return acc;
    }, new Map<string, Array<OutputTypes.DraggableToken | OutputTypes.DraggableCharacter>>());

  return (
    <div className={classes.tray}>
      <>
        {availableEntities.map((entity) => {
          if (entity.type == "character") {
            return (
              <MapCharacter
                key={entity.charId}
                inMap={false}
                character={entity}
              />
            );
          }
        })}
      </>
      <>
        {[...tokensByCharId.entries()].map(([charId, group]) => {
          const entity = group[0];
          if (entity.type == "token") {
            return (
              <div className={classes.tokenGroup} key={charId}>
                <MapToken key={entity.tokenId} inMap={false} token={entity} />
                <span className={classes.tokenQuantity}>{group.length}</span>
              </div>
            );
          }
        })}
      </>
    </div>
  );
};
export default MapEntitiesTray;
