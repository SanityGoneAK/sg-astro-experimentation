import cnCharacterTable from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnBuildingData from "../ArknightsGameData/zh_CN/gamedata/excel/building_data.json";
import enBuildingData from "../ArknightsGameData/en_US/gamedata/excel/building_data.json";
import { fetchJetroyzRiicTranslations } from "./fetch-jetroyz-translations";

import type * as GameDataTypes from "../src/gamedata-types";

export interface RiicSkill {
  stages: Array<{
    buffId: string;
    name: string;
    description: string;
    skillIcon: string;
    minElite: number;
    minLevel: number;
  }>;
}

/**
 * Aggregates RIIC skill data from building_data.json, and for operators not yet released in EN,
 * apply Jetroyz's unofficial translations to their RIIC skills.
 */
export async function aggregateRiicData() {
  const jetRiicTranslations = await fetchJetroyzRiicTranslations();

  const opToRiicSkills: { [operatorId: string]: RiicSkill[] } = {};
  Object.values(cnBuildingData.chars)
    .filter((buffChar) => {
      const { charId } = buffChar;
      const char = cnCharacterTable[
        charId as keyof typeof cnCharacterTable
      ] as GameDataTypes.Character;
      return (
        char.profession !== "TOKEN" &&
        char.profession !== "TRAP" &&
        !char.isNotObtainable
      );
    })
    .forEach((cnCharRiicData) => {
      const { charId } = cnCharRiicData;
      const enCharRiicData =
        enBuildingData.chars[charId as keyof typeof enBuildingData.chars];
      const charBuffs = cnCharRiicData.buffChar.map(
        ({ buffData }, skillIndex) => {
          const buffStages = buffData.map((cnBuff, skillLevelIndex) => {
            let requiresJetTL = false;
            const { buffId } = cnBuff;
            const baseBuffStage = {
              buffId,
              minElite: cnBuff.cond.phase,
              minLevel: cnBuff.cond.level,
            };

            if (enCharRiicData != null) {
              const enBuff =
                enCharRiicData.buffChar[skillIndex].buffData[skillLevelIndex];
              if (cnBuff.buffId !== enBuff.buffId) {
                console.warn(
                  `Mismatch: CN buffId ${cnBuff.buffId} does not match EN buffId ${enBuff.buffId}; adding to forced Jet TL list`
                );
                requiresJetTL = true;
              }
            }

            const enBuffData =
              enBuildingData.buffs[buffId as keyof typeof enBuildingData.buffs];
            const cnBuffData =
              cnBuildingData.buffs[buffId as keyof typeof cnBuildingData.buffs];
            let name = enBuffData?.buffName ?? cnBuffData.buffName;
            let description = enBuffData?.description ?? cnBuffData.description;
            const jetTL = jetRiicTranslations[buffId];
            if ((requiresJetTL || enBuffData == null) && jetTL != null) {
              name = jetTL.name;
              description = jetTL.description;
            } else if (enBuffData == null) {
              console.warn("No translation available for buff: " + buffId);
            }

            return {
              ...baseBuffStage,
              name,
              description,
              skillIcon: cnBuffData.skillIcon,
            };
          });

          return {
            stages: buffStages,
          };
        }
      );
      opToRiicSkills[charId] = charBuffs;
    });
  return opToRiicSkills;
}

// FIXME DEBUG
aggregateRiicData();
