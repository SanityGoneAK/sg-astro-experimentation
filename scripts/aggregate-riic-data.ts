import cnCharacterTable from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import cnBuildingData from "../ArknightsGameData/zh_CN/gamedata/excel/building_data.json";
import enBuildingData from "../ArknightsGameData/en_US/gamedata/excel/building_data.json";
import { fetchJetroyzRiicTranslations } from "./fetch-jetroyz-translations";

import type * as GameDataTypes from "../src/gamedata-types";

export interface RiicSkill {
  buffId: string;
  name: string;
  description: string;
  skillIcon: string;
  minElite: number;
  minLevel: number;
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
    .forEach((charRiicData) => {
      const { charId } = charRiicData;
      const charBuffs = charRiicData.buffChar.flatMap(({ buffData }) => {
        return buffData.map((buff) => {
          return {
            buffId: buff.buffId,
            minElite: buff.cond.phase,
            minLevel: buff.cond.level,
          };
        });
      });

      const charBuffsFull = charBuffs.map((charBuff) => {
        const { buffId } = charBuff;
        const isInEN =
          enBuildingData.buffs[buffId as keyof typeof enBuildingData.buffs] !=
          null;
        const buffProperties =
          enBuildingData.buffs[buffId as keyof typeof enBuildingData.buffs] ??
          cnBuildingData.buffs[buffId as keyof typeof cnBuildingData.buffs];

        let name = buffProperties.buffName;
        let description = buffProperties.description;
        if (!isInEN) {
          const jetTL = jetRiicTranslations[buffId];
          if (jetTL != null) {
            name = jetTL.name;
            description = jetTL.description;
          } else {
            console.warn("No translation available for buff: " + buffId);
          }
        }

        return {
          ...charBuff,
          name,
          description,
          skillIcon: buffProperties.skillIcon,
        };
      });

      opToRiicSkills[charId] = charBuffsFull;
    });
  return opToRiicSkills;
}
