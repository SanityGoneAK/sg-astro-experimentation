import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { actionsStore, setActionIndex } from "../../pages/maps/_store";
import { enemyAvatar } from "../../utils/images";

const MapActionsTable: React.FC = () => {
  const actions = useStore(actionsStore);

  return actions != null ? (
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
              <td className={classes.tableItem}>{action.waveElapsedTime}s</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <div></div>
  );
};
export default MapActionsTable;
