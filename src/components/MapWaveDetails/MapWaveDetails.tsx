import { useStore } from "@nanostores/react";
import {
  currentActionStore,
  decreaseActionIndex,
  increaseActionIndex,
} from "../../pages/maps/_store";
import * as classes from "./styles.css";

const MapWaveDetails: React.FC = () => {
  const action = useStore(currentActionStore);

  return (
    <div className={classes.details}>
      {action != null && (
        <div className={classes.actionDetails}>
          <ul className={classes.actionDetailsList}>
            <li className={classes.actionListItem}>
              <span>Wave</span>
              <span>{action.waveIndex}</span>
            </li>
            <li className={classes.actionListItem}>
              <span>Index</span>
              <span>
                {action.enemyRangeStart - action.enemyRangeEnd == 0
                  ? action.enemyRangeStart
                  : `${action.enemyRangeStart} - ${action.enemyRangeEnd}`}
              </span>
            </li>
            <li className={classes.actionListItem}>
              <span>Elapsed Time</span>
              <span>{action.elapsedTime}s</span>
            </li>
            <li className={classes.actionListItem}>
              <span>Interval</span>
              <span>{action.interval}s</span>
            </li>
          </ul>
        </div>
      )}
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
    </div>
  );
};
export default MapWaveDetails;
