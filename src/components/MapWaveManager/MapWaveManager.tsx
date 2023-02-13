import * as classes from "./styles.css";
import type * as OutputTypes from "../../output-types";
import { useCallback, useMemo, useState } from "react";
import type { Index } from "flexsearch";
import { enemyAvatar } from "../../utils/images";

interface Props {
  waves: OutputTypes.Wave[];
  routes: OutputTypes.Route[];
  setRoute: (route: OutputTypes.Route | null) => void;
}

interface WaveFragmentAction extends OutputTypes.WaveFragmentAction {
  waveIndex: number;
  elapsedTime: number;
  waveElapsedTime: number;
  enemyRangeStart: number;
  enemyRangeEnd: number;
}

const MapWaveManager: React.FC<Props> = ({ waves, routes, setRoute }) => {
  const [action, setActionIndex] = useState<number | null>(null);

  const actions = useMemo(() => {
    const actions: WaveFragmentAction[] = [];
    let elapsedTime = 0;
    let enemyCount = 0;
    waves.forEach((wave, index) => {
      let waveElapsedTime = 0;
      elapsedTime += wave.preDelay;

      wave.fragments.forEach((fragment) => {
        waveElapsedTime += fragment.preDelay;
        let maxFragmentTime = waveElapsedTime;
        fragment.actions
          .sort((a, b) => a.preDelay - b.preDelay)
          .forEach((action) => {
            if (action.actionType == 0) {
              // All actions of a fragment are triggered at the same time, they are just delayed using the action.preDelay
              // The Math.max here is to figure out which one takes the longest to come out and add that at the end of the wave.
              maxFragmentTime = Math.max(
                maxFragmentTime,
                waveElapsedTime +
                  action.preDelay +
                  (action.count - 1) * action.interval
              );
              actions.push({
                ...action,
                waveIndex: index,
                elapsedTime: waveElapsedTime + action.preDelay + elapsedTime,
                waveElapsedTime: waveElapsedTime + action.preDelay,
                enemyRangeStart: enemyCount + 1,
                enemyRangeEnd: enemyCount + action.count,
              });
              enemyCount += action.count;
            }
          });
        waveElapsedTime = maxFragmentTime;
      });
      // Waves would wait up to 50 seconds until you start the next wave.
      // PRTS just adds 5 seconds between waves.
      elapsedTime += waveElapsedTime + 5;
      waveElapsedTime += wave.postDelay;
    });
    return actions;
  }, [waves]);

  const getNextAction = useCallback(
    (action: number | null) => {
      if (action != null && actions.length - 1 > action) {
        setActionIndex(action + 1);
        setRoute(routes[actions[action].routeIndex]);
        return;
      }
      setActionIndex(0);
      setRoute(routes[actions[0].routeIndex]);
    },
    [actions, routes, setRoute]
  );

  const getPrevAction = useCallback(
    (action: number | null) => {
      if (action != null && action > 0) {
        setActionIndex(action - 1);
        setRoute(routes[actions[action].routeIndex]);
        return;
      }
      setActionIndex(null);
      setRoute(null);
    },
    [actions, routes, setRoute]
  );

  const setAction = useCallback(
    function (actionIndex: number) {
      setActionIndex(actionIndex);
      console.log(routes[actions[actionIndex].routeIndex]);
      setRoute(routes[actions[actionIndex].routeIndex]);
      window.scrollTo(0, 0);
    },
    [actions, routes, setRoute]
  );

  return (
    <div className={classes.waveContainer}>
      <div className={classes.details}>
        <div className={classes.buttonContainer}>
          <button
            className={classes.actionButton}
            onClick={() => getPrevAction(action)}
          >
            Decrease
          </button>
          <button
            className={classes.actionButton}
            onClick={() => getNextAction(action)}
          >
            Increase
          </button>
        </div>
        {action != null && (
          <div className={classes.actionDetails}>
            <ul>
              <li>
                <span>Wave</span>
                <span>{actions[action].waveIndex}</span>
              </li>
              <li>
                <span>Index</span>
                <span>
                  {actions[action].enemyRangeStart -
                    actions[action].enemyRangeEnd ==
                  0
                    ? actions[action].enemyRangeStart
                    : `${actions[action].enemyRangeStart} - ${actions[action].enemyRangeEnd}`}
                </span>
              </li>
              <li>
                <span>Elapsed Time</span>
                <span>{actions[action].elapsedTime}s</span>
              </li>
              <li>
                <span>Interval</span>
                <span>{actions[action].interval}s</span>
              </li>
            </ul>
            <div>
              <img
                width={64}
                height={64}
                src={enemyAvatar(actions[action].key)}
              />
              <span>x{actions[action].count}</span>
            </div>
          </div>
        )}
      </div>
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
                onClick={() => setAction(key)}
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
    </div>
  );
};
export default MapWaveManager;
