import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { operatorStore, tokensByCharId } from "../../pages/maps/_store";
import MapCharacter from "../MapCharacter";
import MapToken from "../MapToken";

const MapEntitiesTray: React.FC = () => {
  const operators = useStore(operatorStore);
  const tokens = useStore(tokensByCharId);
  const availableOperators = operators.filter(
    (operator) => operator.row == null && operator.col == null
  );

  return (
    <div className={classes.tray}>
      <>
        {availableOperators.map((operator) => {
          return (
            <MapCharacter
              key={operator.charId}
              inMap={false}
              character={operator}
            />
          );
        })}
      </>
      <>
        {[...tokens.entries()].map(([charId, group]) => {
          const availableTokens = group.filter(
            (token) => token.col == null && token.row == null
          );
          const entity = availableTokens[0];
          if (entity && entity.type == "token") {
            return (
              <div className={classes.tokenGroup} key={charId}>
                <MapToken key={entity.tokenId} inMap={false} token={entity} />
                <span className={classes.tokenQuantity}>
                  {availableTokens.length}
                </span>
              </div>
            );
          }
        })}
      </>
    </div>
  );
};
export default MapEntitiesTray;
