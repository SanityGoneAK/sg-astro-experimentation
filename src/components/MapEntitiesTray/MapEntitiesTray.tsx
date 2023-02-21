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
      <div className={classes.addCharacter}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-1.04907e-06 24C-1.00079e-06 25.1046 0.895431 26 2 26L22 26L22 46C22 47.1046 22.8954 48 24 48C25.1046 48 26 47.1046 26 46L26 26L46 26C47.1046 26 48 25.1046 48 24C48 22.8954 47.1046 22 46 22L26 22L26 2C26 0.89543 25.1046 -1.09736e-06 24 -1.04907e-06C22.8954 -1.00079e-06 22 0.895431 22 2L22 22L2 22C0.89543 22 -1.09736e-06 22.8954 -1.04907e-06 24Z"
            fill="#D9D9D9"
          />
        </svg>
      </div>
    </div>
  );
};
export default MapEntitiesTray;
