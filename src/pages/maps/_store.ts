import { action, atom, computed, map } from "nanostores";

import { levelScenePairs } from "../../../ArknightsGameData/zh_CN/gamedata/battle/battle_misc_table.json";
import mapsJson from "../../../data/maps.json";
import operatorsJson from "../../../data/operators.json";

import type * as OutputTypes from "../../output-types";
import { getStatsAtLevel } from "../../utils/character-stats";

export const stageIdStore = atom<string>(
  typeof window !== "undefined" ? (window as any).stageId : ""
);

const getCorrectLevelId = (levelId: string): string => {
  return levelScenePairs[levelId as keyof typeof levelScenePairs]
    ? levelScenePairs[levelId as keyof typeof levelScenePairs].levelId
    : levelId;
};

const getDefaultTokens = async () => {
  const rangeMapping = {
    trap_001_crate: "MELEE",
  };

  const stageId = typeof window !== "undefined" ? (window as any).stageId : "";

  const stageInfo = mapsJson[
    stageIdStore.get() as keyof typeof mapsJson
  ] as OutputTypes.StageInfo;
  const locale = stageInfo.isCnOnly ? "zh_CN" : "en_US";
  const stageData = (await import(
    "../../../ArknightsGameData/" +
      locale +
      "/gamedata/levels/" +
      getCorrectLevelId(stageInfo.levelId).toLowerCase() +
      ".json"
  )) as OutputTypes.StageData;

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

  return tokens.reduce((acc, cur) => {
    (acc[cur.charId] = acc[cur.charId] || []).push(cur);
    return acc;
  }, {} as Record<string, OutputTypes.DraggableToken[]>);
};

const getDebugOperators = (): Record<
  string,
  OutputTypes.DraggableCharacter
> => {
  const operatorIds = ["char_197_poca", "char_1028_texas2"];
  const operators = operatorIds.map((opId) => {
    const operator = operatorsJson[
      opId as keyof typeof operatorsJson
    ] as OutputTypes.Character;

    return [
      opId,
      {
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
      },
    ];
  });

  return Object.fromEntries(operators);
};

export const operatorStore = map<
  Record<string, OutputTypes.DraggableCharacter>
>(getDebugOperators());
export const tokensStore = map<Record<string, OutputTypes.DraggableToken[]>>(
  {}
);

export const entitiesStore = computed(
  [operatorStore, tokensStore],
  (operators, tokens) => {
    return [
      ...Object.values(operators),
      ...Object.values(tokens).flatMap((token) => token),
    ];
  }
);

export const removeOperatorCoordinates = action(
  operatorStore,
  "removeOperatorCoordinates",
  (store, entity: OutputTypes.DraggableCharacter) => {
    store.set({ ...store.get(), [entity.charId]: entity });
    return store;
  }
);

// const getDefaultTokens = async () => {
//   const rangeMapping = {
//     trap_001_crate: "MELEE",
//   };

//   const stageInfo = mapsJson[
//     stageIdStore.get() as keyof typeof mapsJson
//   ] as OutputTypes.StageInfo;
//   const locale = stageInfo.isCnOnly ? "zh_CN" : "en_US";
//   const stageData = (await import(
//     "../../../ArknightsGameData/" +
//       locale +
//       "/gamedata/levels/" +
//       getCorrectLevelId(stageInfo.levelId).toLowerCase() +
//       ".json"
//   )) as OutputTypes.StageData;

//   const tokens: OutputTypes.DraggableToken[] = [];
//   stageData.predefines.tokenCards.forEach((token) => {
//     for (let index = 1; index < token.initialCnt; index++) {
//       tokens.push({
//         row: null,
//         col: null,
//         charId: token.inst.characterKey,
//         tokenId: token.inst.characterKey + "-" + index,
//         type: "token",
//         tokeObject: token,
//         range: rangeMapping[
//           token.inst.characterKey as keyof typeof rangeMapping
//         ] as "MELEE" | "RANGED",
//       });
//     }
//   });

//   return tokens;
// };

// export const operatorStore = atom<OutputTypes.DraggableCharacter[]>([]);
// export const tokensStore = atom<OutputTypes.DraggableToken[]>(
//   await getDefaultTokens()
// );

// export const tokensByCharId = computed([tokensStore], (tokens) => {
//   tokens.reduce((acc, curr) => {
//     acc.set(curr.charId, [...(acc.get(curr.charId) ?? []), curr]);
//     return acc;
//   }, new Map<string, Array<OutputTypes.DraggableToken>>());
// });

// export const entitiesStore = computed(
//   [operatorStore, tokensStore],
//   (operators, tokens) => {
//     return new Set([...operators, ...tokens]);
//   }
// );
