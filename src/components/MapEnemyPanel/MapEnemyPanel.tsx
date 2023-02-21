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
        <div className={classes.root}>
          <div className={classes.enemyPortrait}>
            <img
              className={classes.enemyPortraitImage}
              width={64}
              height={64}
              src={enemyAvatar(currentEnemy.enemyId)}
            />
            <p className={classes.enemyCount}>x{action.count}</p>
          </div>
          <dl className={classes.attributesList}>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>HP</dt>
              <dd className={classes.attributeDetail}>
                {attributes.maxHp.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>HP Recovery</dt>
              <dd className={classes.attributeDetail}>
                {attributes.hpRecoveryPerSec.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Atk</dt>
              <dd className={classes.attributeDetail}>
                {attributes.atk.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Atk Time</dt>
              <dd className={classes.attributeDetail}>
                {attributes.attackSpeed.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Def</dt>
              <dd className={classes.attributeDetail}>
                {attributes.def.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Magic Res</dt>
              <dd className={classes.attributeDetail}>
                {attributes.magicResistance.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Speed</dt>
              <dd className={classes.attributeDetail}>
                {attributes.moveSpeed.m_value}
              </dd>
            </div>
            <div className={classes.attribute}>
              <dt className={classes.attributeTitle}>Weight</dt>
              <dd className={classes.attributeDetail}>
                {attributes.massLevel.m_value}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};
export default MapEnemyPanel;
