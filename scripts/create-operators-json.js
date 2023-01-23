import { promises as fs } from "fs";
import path from "path";

import enCharacterTable from "../ArknightsGameData/en_US/gamedata/excel/character_table.json";
import { patchChars as enPatchChars } from "../ArknightsGameData/en_US/gamedata/excel/char_patch_table.json";
import cnCharacterTable from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import enSkillTable from "../ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import cnSkillTable from "../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import rangeTable from "../ArknightsGameData/zh_CN/gamedata/excel/range_table.json";
import voiceTable from "../ArknightsGameData/zh_CN/gamedata/excel/charword_table.json";
import skinTable from "../ArknightsGameData/zh_CN/gamedata/excel/skin_table.json";

import { fetchJetroyzSkillTalentTranslations } from "./fetch-jetroyz-translations";
import { getReleaseOrderAndLimitedLookup } from "./scrape-prts";
import { aggregateModuleData } from "./aggregate-module-data.js";
import { getAlterMapping } from "./get-alters.js";

/** @type {{ [characterId: string]: string }} */
const NAME_OVERRIDES = {
  char_376_therex: "Thermal-EX",
  char_1001_amiya2: "Amiya (Guard)",
  char_4055_bgsnow: "Pozёmka",
};

/**
 * Creates `{dataDir}/operators.json`, Sanity;Gone's "gigafile" containing
 * - base operator data from character_table
 * - denormalized skill data from skill_table
 * - denormalized range data from range_table
 * - module data from uniequip_table and battle_equip_table
 * - this operator's summons from character_table
 *
 * @param {string} dataDir - output directory
 */
export async function createOperatorsJson(dataDir) {
  console.log(`Creating ${path.join(dataDir, "operators.json")}...`);

  const enCharacterIds = new Set(Object.keys(enCharacterTable));
  const cnOnlyCharacters = Object.entries(cnCharacterTable).filter(
    ([charId]) => !enCharacterIds.has(charId)
  );

  const { jetSkillTranslations, jetTalentTranslations } =
    await fetchJetroyzSkillTalentTranslations();

  const summonIdToOperatorId = {};
  const denormalizedCharacters = [
    ...Object.entries(enCharacterTable),
    ...cnOnlyCharacters,
    ...Object.entries(enPatchChars),
  ]
    .filter(
      ([charId, character]) =>
        character.profession !== "TRAP" &&
        !charId.startsWith("trap_") &&
        !character.isNotObtainable
    )
    .map(([charId, character]) => {
      const isCnOnly = !enCharacterIds.has(charId);
      const characterName =
        NAME_OVERRIDES[charId] ??
        (isCnOnly ? character.appellation : character.name);

      character.skills
        .filter((skill) => skill.overrideTokenKey != null)
        .forEach((skill) => {
          summonIdToOperatorId[skill.overrideTokenKey] = charId;
        });

      const phases = character.phases.map((phase) => ({
        ...phase,
        range: phase.rangeId ? rangeTable[phase.rangeId] : null,
      }));

      const talents = (character.talents || []).map((talent, talentIndex) => {
        const candidates = (talent.candidates || []).map(
          (candidate, phaseIndex) => {
            const baseCandidateObject = {
              ...candidate,
              range: candidate.rangeId ? rangeTable[candidate.rangeId] : null,
            };
            if (isCnOnly && character.profession !== "TOKEN") {
              try {
                const talentTL =
                  jetTalentTranslations[charId][talentIndex][phaseIndex];
                baseCandidateObject.name = talentTL.name;
                baseCandidateObject.description = talentTL.desc;
              } catch {
                console.warn(
                  `No translation found for: character ${charId}, talent index ${talentIndex}, phase index ${phaseIndex}`
                );
              }
            }
            return baseCandidateObject;
          }
        );
        return { ...talent, candidates };
      });

      const skillData = character.skills
        .filter((skill) => skill.skillId != null)
        .map((skill) => {
          const skillId = skill.skillId;
          const baseSkillObject = isCnOnly
            ? cnSkillTable[skillId]
            : enSkillTable[skillId];

          const levels = baseSkillObject.levels.map(
            (skillAtLevel, levelIndex) => {
              const baseSkillLevelObject = {
                ...skillAtLevel,
                range: skillAtLevel.rangeId
                  ? rangeTable[skillAtLevel.rangeId]
                  : null,
              };

              // SPECIAL CASES
              // - heavyrain s1 (skchr_zebra_1) interpolates "duration" but this value is missing from the blackboard;
              //   we have to append it to the blackboard manually
              if (skillId === "skchr_zebra_1") {
                baseSkillLevelObject.blackboard.push({
                  key: "duration",
                  value: baseSkillLevelObject.duration,
                });
              }

              if (isCnOnly && character.profession !== "TOKEN") {
                try {
                  const skillTL = jetSkillTranslations[skillId];
                  baseSkillLevelObject.name = skillTL.name;
                  baseSkillLevelObject.description = skillTL.desc[levelIndex];
                } catch {
                  console.warn(
                    `No translation found for: skill ${skillId}, level index ${levelIndex}`
                  );
                }
              }
              return baseSkillLevelObject;
            }
          );
          return {
            ...baseSkillObject,
            levels,
          };
        })
        .filter((skillData) => !!skillData);

      const voiceLang = voiceTable["voiceLangDict"];
      const voiceActorObject = voiceLang[charId];
      const voices = voiceActorObject
        ? Object.values(voiceActorObject.dict)
        : [];

      const charSkins = skinTable["charSkins"];
      const skins = Object.values(charSkins)
        .filter((skin) => {
          // special case:
          // amiya's guard form shows up as a skin, so we should filter that out
          if (skin.skinId === "char_1001_amiya2#2") return false;
          return skin.charId === charId;
        })
        .map((skin) => {
          return {
            skinId: skin.skinId,
            illustId: skin.illustId,
            avatarId: skin.avatarId,
            portraitId: skin.portraitId,
            displaySkin: {
              skinName: skin.displaySkin.skinName,
              modelName: skin.displaySkin.modelName,
              drawerList: skin.displaySkin.drawerList,
            },
          };
        });

      const mostRecentCharData =
        cnCharacterTable[charId] ?? enPatchChars[charId];
      const { name: cnName, subProfessionId } = mostRecentCharData;

      if (character.tokenKey) {
        summonIdToOperatorId[character.tokenKey] = charId;
      }

      return {
        charId,
        ...character,
        rarity: character.rarity + 1, // convert gamedata's 0-index to a 1-index
        cnName,
        isCnOnly,
        name: characterName,
        subProfessionId,
        skillData,
        phases,
        talents,
        voices,
        skins,
      };
    });

  const denormalizedSummonEntries = denormalizedCharacters
    .filter((character) => character.profession === "TOKEN")
    .map((summon) => [
      summonIdToOperatorId[summon.charId],
      {
        ...summon,
        operatorId: summonIdToOperatorId[summon.charId],
      },
    ]);
  const denormalizedSummons = denormalizedSummonEntries.reduce(
    (acc, [operatorId, summon]) => {
      acc[operatorId] = [...(acc[operatorId] ?? []), summon];
      return acc;
    },
    {}
  );

  const operatorModulesMap = aggregateModuleData();
  const releaseOrderAndLimitedLookup = await getReleaseOrderAndLimitedLookup();
  const { alterIdToBaseOpId, baseOpIdToAlterId } = getAlterMapping();

  const denormalizedOperators = denormalizedCharacters
    .filter((character) => character.profession !== "TOKEN")
    .map((character) => [
      character.charId,
      {
        ...character,
        ...releaseOrderAndLimitedLookup[character.cnName],
        summons: denormalizedSummons[character.charId] ?? [],
        modules: operatorModulesMap[character.charId] ?? [],
        alterId: baseOpIdToAlterId[character.charId] ?? null,
        baseOperatorId: alterIdToBaseOpId[character.charId] ?? null,
      },
    ]);
  // sort by descending rarity and descending release order
  denormalizedOperators.sort(([_, charA], [__, charB]) => {
    return (
      charB.rarity - charA.rarity || charB.releaseOrder - charA.releaseOrder
    );
  });

  const operatorsJson = Object.fromEntries(denormalizedOperators);
  await fs.writeFile(
    path.join(dataDir, "operators.json"),
    JSON.stringify(operatorsJson, null, 2)
  );
}
