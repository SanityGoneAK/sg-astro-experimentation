import { action, atom, computed, map } from "nanostores";

import { levelScenePairs } from "../../../ArknightsGameData/zh_CN/gamedata/battle/battle_misc_table.json";
import mapsJson from "../../../data/maps.json";
import operatorsJson from "../../../data/operators.json";
import { getStatsAtLevel } from "../../utils/character-stats";

import type * as OutputTypes from "../../output-types";

export const stageIdStore = atom<string>(
  typeof window !== "undefined" ? (window as any).stageId : ""
);

const getCorrectLevelId = (levelId: string): string => {
  return levelScenePairs[levelId as keyof typeof levelScenePairs]
    ? levelScenePairs[levelId as keyof typeof levelScenePairs].levelId
    : levelId;
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

export const operatorStore = atom<OutputTypes.DraggableCharacter[]>(
  getDebugOperators()
);
export const tokensStore = atom<OutputTypes.DraggableToken[]>([]);

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

// Actions
export const retreatOperator = action(
  operatorStore,
  "retreatOperator",
  (store, entity: OutputTypes.DraggableCharacter) => {
    return store.get().map((entityObject) => {
      if (entity.charId == entityObject.charId) {
        entity.row = null;
        entity.col = null;
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
