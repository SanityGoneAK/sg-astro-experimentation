import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import {
  actionsStore,
  currentActionStore,
  currentEnemyStore,
  decreaseActionIndex,
  increaseActionIndex,
  setActionIndex,
} from "../../pages/maps/_store";
import { enemyAvatar } from "../../utils/images";

const MapWaveManager: React.FC = () => {
  const action = useStore(currentActionStore);
  const actions = useStore(actionsStore);
  const enemy = useStore(currentEnemyStore);

  return (
    <div className={classes.waveContainer}>
      <div className={classes.details}>
        <div className={classes.buttonContainer}>
          <button
            className={classes.actionButton}
            onClick={() => decreaseActionIndex()}
          >
            Decrease
          </button>
          <button
            className={classes.actionButton}
            onClick={() => increaseActionIndex()}
          >
            Increase
          </button>
        </div>
        {action != null && (
          <div className={classes.actionDetails}>
            <ul>
              <li>
                <span>Wave</span>
                <span>{action.waveIndex}</span>
              </li>
              <li>
                <span>Index</span>
                <span>
                  {action.enemyRangeStart - action.enemyRangeEnd == 0
                    ? action.enemyRangeStart
                    : `${action.enemyRangeStart} - ${action.enemyRangeEnd}`}
                </span>
              </li>
              <li>
                <span>Elapsed Time</span>
                <span>{action.elapsedTime}s</span>
              </li>
              <li>
                <span>Interval</span>
                <span>{action.interval}s</span>
              </li>
            </ul>
          </div>
        )}
      </div>
      {actions != null && (
        <table className={classes.table}>
          <thead>
            <tr className={classes.tableRow}>
              <th className={classes.tableItem}>#</th>
              <th className={classes.tableItem}>Enemy</th>
              <th className={classes.tableItem}>Index</th>
              <th className={classes.tableItem}>Interval</th>
              <th className={classes.tableItem}>Timestamp</th>
              <th className={classes.tableItem}>Wave Time</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action, key) => {
              return (
                <tr
                  className={classes.tableRow}
                  key={key}
                  onClick={() => setActionIndex(key)}
                >
                  <td className={classes.tableItem}>{key}</td>
                  <td className={classes.enemyTableItem}>
                    <img width={64} height={64} src={enemyAvatar(action.key)} />
                    <span>x{action.count}</span>
                  </td>
                  <td className={classes.tableItem}>
                    {action.enemyRangeStart - action.enemyRangeEnd == 0
                      ? action.enemyRangeStart
                      : `${action.enemyRangeStart} - ${action.enemyRangeEnd}`}
                  </td>
                  <td className={classes.tableItem}>{action.interval}s</td>
                  <td className={classes.tableItem}>{action.elapsedTime}s</td>
                  <td className={classes.tableItem}>
                    {action.waveElapsedTime}s
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default MapWaveManager;
