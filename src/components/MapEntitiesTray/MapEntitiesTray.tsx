import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { entitiesStore, tokensByCharId } from "../../pages/maps/_store";
import MapCharacter from "../MapCharacter";
import MapToken from "../MapToken";

import type * as OutputTypes from "../../output-types";

const MapEntitiesTray: React.FC = () => {
  const entities = useStore(entitiesStore);
  const tokens = useStore(tokensByCharId);
  const availableEntities = entities.filter(
    (entity) => entity.row == null && entity.col == null
  );

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
        {[...tokens.entries()].map(([charId, group]) => {
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
