import { action, atom, computed, map } from "nanostores";

import { levelScenePairs } from "../../../ArknightsGameData/zh_CN/gamedata/battle/battle_misc_table.json";
import mapsJson from "../../../data/maps.json";
import operatorsJson from "../../../data/operators.json";
import { getStatsAtLevel } from "../../utils/character-stats";

import type * as OutputTypes from "../../output-types";



export const stageIdStore = atom<string>(
  typeof window !== "undefined" ? (window as any).stageId : ""
);

// Utility Functions
const getDefaultTokens = (stageData: OutputTypes.StageData) => {
  const rangeMapping = {
    trap_001_crate: "MELEE",
  };
  const tokens: OutputTypes.DraggableToken[] = [];
  stageData.predefines.tokenCards.forEach((token) => {
    for (let index = 1; index < token.initialCnt; index++) {
      tokens.push({
        row: null,
        col: null,
        charId: token.inst.characterKey,
        tokenId: token.inst.characterKey + "-" + index,
        type: "token",
        tokeObject: token,
        range: rangeMapping[
          token.inst.characterKey as keyof typeof rangeMapping
        ] as "MELEE" | "RANGED",
      });
    }
  });

  return tokens;
};
const getDebugOperators = () => {
  const operatorIds = ["char_197_poca", "char_1028_texas2"];
  const operators = operatorIds.map((opId) => {
    const operator = operatorsJson[
      opId as keyof typeof operatorsJson
    ] as OutputTypes.Character;

    return {
      row: null,
      col: null,
      charId: opId,
      range: operator.position,
      type: "character",
      stats: getStatsAtLevel(operator, {
        eliteLevel: 2,
        level: 80,
        pots: false,
        trust: false,
      }),
      characterObject: operator,
    };
  });

  return operators as OutputTypes.DraggableCharacter[];
};
const getActionData = (waves: OutputTypes.Wave[]) => {
  const actions: OutputTypes.WaveFragmentAction[] = [];
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
};

// Stores
export const operatorStore = atom<OutputTypes.DraggableCharacter[]>(
  getDebugOperators()
);
export const tokensStore = atom<OutputTypes.DraggableToken[]>([]);
export const currentActionIndexStore = atom<number | null>(null);
export const actionsStore = atom<OutputTypes.WaveFragmentAction[]>([]);
export const routesStore = atom<OutputTypes.Route[]>([]);

// Computed Stores
export const tokensByCharId = computed([tokensStore], (tokens) => {
  return tokens.reduce((acc, curr) => {
    acc.set(curr.charId, [...(acc.get(curr.charId) ?? []), curr]);
    return acc;
  }, new Map<string, Array<OutputTypes.DraggableToken>>());
});
export const entitiesStore = computed(
  [operatorStore, tokensStore],
  (operators, tokens) => {
    return [...operators, ...tokens];
  }
);
export const currentRouteStore = computed(
  [currentActionIndexStore, actionsStore, routesStore],
  (actionIndex, actions, routes) => {
    if (actionIndex != null && actions.length > 0 && routes.length > 0) {
      return routes[actions[actionIndex].routeIndex];
    }
    return null;
  }
);
export const currentAction = computed(
  [currentActionIndexStore, actionsStore],
  (actionIndex, actions) => {
    if (actionIndex && actions.length > 0) {
      return actions[actionIndex];
    }
    return null;
  }
);

// Actions
export const setTokenDefaults = action(
  tokensStore,
  "setTokenDefaults",
  (store, stageData: OutputTypes.StageData) => {
    store.set(getDefaultTokens(stageData));
  }
);
export const deployToken = action(
  tokensStore,
  "deployToken",
  (store, entity: OutputTypes.DraggableToken, col, row) => {
    return store.get().map((entityObject) => {
      if (entity.tokenId == entityObject.tokenId) {
        entity.row = row;
        entity.col = col;
        return entity;
      }
      return entityObject;
    });
  }
);
export const retreatToken = action(
  tokensStore,
  "retreatToken",
  (store, entity: OutputTypes.DraggableToken) => {
    return store.get().map((entityObject) => {
      if (entity.tokenId == entityObject.tokenId) {
        entity.row = null;
        entity.col = null;
        return entity;
      }
      return entityObject;
    });
  }
);
export const deployOperator = action(
  operatorStore,
  "deployOperator",
  (store, entity: OutputTypes.DraggableCharacter, col, row) => {
    return store.get().map((entityObject) => {
      if (entity.charId == entityObject.charId) {
        entity.row = row;
        entity.col = col;
        return entity;
      }
      return entityObject;
    });
  }
);
export const retreatOperator = action(
  operatorStore,
  "retreatOperator",
  (store, entity: OutputTypes.DraggableCharacter) => {
    return store.set(
      store.get().map((entityObject) => {
        if (entity.charId == entityObject.charId) {
          entity.row = null;
          entity.col = null;
          return entity;
        }
        return entityObject;
      })
    );
  }
);

export const setActionDefaults = action(
  actionsStore,
  "setActionDefaults",
  (store, waves: OutputTypes.Wave[]) => {
    store.set(getActionData(waves));
  }
);
export const increaseActionIndex = action(
  currentActionIndexStore,
  "increaseActionIndex",
  (store) => {
    const action = store.get();
    if (action != null && actionsStore.get().length - 1 > action) {
      store.set(action + 1);
      console.log(store.get());
      return;
    }
    store.set(0);
  }
);
export const decreaseActionIndex = action(
  currentActionIndexStore,
  "decreaseActionIndex",
  (store) => {
    const action = store.get();
    if (action != null && action > 0) {
      store.set(action - 1);
      return;
    }
    store.set(null);
  }
);
export const setActionIndex = action(
  currentActionIndexStore,
  "setActionIndex",
  (store, newIndex) => {
    store.set(newIndex);
  }
);
