import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";
import { useStore } from "@nanostores/react";
import { currentEnemyStore, currentActionStore } from "../../pages/maps/_store";
import { useMemo } from "react";
import { enemyAvatar } from "../../utils/images";

interface Props {
  mapEnemy: OutputTypes.EnemyDbRefs[];
}

const MapEnemyPanel: React.FC<Props> = ({ mapEnemy }) => {
  const currentEnemy = useStore(currentEnemyStore);
  const action = useStore(currentActionStore);

  const attributes = useMemo(() => {
    const routeEnemy = mapEnemy.find((e) => e.id == currentEnemy?.enemyId);
    if (routeEnemy == null) return null;

    if (routeEnemy.useDb == true && routeEnemy.overwrittenData == null) {
      return currentEnemy?.levels[routeEnemy.level].attributes;
    }

    return routeEnemy.overwrittenData?.attributes;
  }, [currentEnemy, mapEnemy]);

  return (
    <div>
      {currentEnemy != null && action != null && attributes && (
        <div>
          <img width={64} height={64} src={enemyAvatar(currentEnemy.enemyId)} />
          <span>x{action.count}</span>
          <div>
            <div>
              <h3>HP</h3>
              <p>{attributes.maxHp.m_value}</p>
            </div>
            <div>
              <h3>HP Recovery</h3>
              <p>{attributes.hpRecoveryPerSec.m_value}</p>
            </div>
            <div>
              <h3>Atk</h3>
              <p>{attributes.atk.m_value}</p>
            </div>
            <div>
              <h3>Atk Time</h3>
              <p>{attributes.attackSpeed.m_value}</p>
            </div>
            <div>
              <h3>Def</h3>
              <p>{attributes.def.m_value}</p>
            </div>
            <div>
              <h3>Magic Res</h3>
              <p>{attributes.magicResistance.m_value}</p>
            </div>
            <div>
              <h3>Speed</h3>
              <p>{attributes.moveSpeed.m_value}</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>{attributes.massLevel.m_value}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MapEnemyPanel;
