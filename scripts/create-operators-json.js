import { promises as fs } from "fs";
import path from "path";

import { aggregateModuleData } from "./aggregate-module-data.js";
import { aggregateRiicData } from "./aggregate-riic-data";
import {
  fetchJetroyzSkillTranslations,
  fetchJetroyzTalentTranslations,
} from "./fetch-jetroyz-translations";
import { getAlterMapping } from "./get-alters.js";
import {
  getReleaseOrderAndLimitedLookup,
  getSkinObtainSourceAndCosts,
} from "./scrape-prts";
import { patchChars as enPatchChars } from "../ArknightsGameData/en_US/gamedata/excel/char_patch_table.json";
import enCharacterTable from "../ArknightsGameData/en_US/gamedata/excel/character_table.json";
import enSkillTable from "../ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import enSkinTable from "../ArknightsGameData/en_US/gamedata/excel/skin_table.json";
import cnCharacterTable from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import voiceTable from "../ArknightsGameData/zh_CN/gamedata/excel/charword_table.json";
import rangeTable from "../ArknightsGameData/zh_CN/gamedata/excel/range_table.json";
import cnSkillTable from "../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import cnSkinTable from "../ArknightsGameData/zh_CN/gamedata/excel/skin_table.json";

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

  const [
    jetSkillTranslations,
    jetTalentTranslations,
    skinSourceAndCostLookup,
    releaseOrderAndLimitedLookup,
    opToRiicSkillsMap,
  ] = await Promise.all([
    fetchJetroyzSkillTranslations(),
    fetchJetroyzTalentTranslations(),
    getSkinObtainSourceAndCosts(),
    getReleaseOrderAndLimitedLookup(),
    aggregateRiicData(),
  ]);

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

      const charSkins = cnSkinTable["charSkins"];
      const skins = Object.values(charSkins)
        .filter((skin) => {
          // special case:
          // amiya's guard form shows up as a skin, so we should filter that out
          if (skin.skinId === "char_1001_amiya2#2") return false;
          return skin.charId === charId;
        })
        .map((cnSkin) => {
          let skinType = "elite-zero";
          let skinSourcesAndCosts = {};
          let elite;
          if (
            cnSkin.displaySkin.skinName == null &&
            (cnSkin.avatarId.endsWith("_1+") || cnSkin.avatarId.endsWith("_2"))
          ) {
            skinType = "elite-one-or-two";
            elite = cnSkin.avatarId.endsWith("_1+") ? 1 : 2;
          } else if (cnSkin.displaySkin.skinName != null) {
            // if this is a special skin (i.e. not just an operator's default e0/e1/e2 art),
            // look up the skin's obtain sources + cost
            skinType = "skin";
            skinSourcesAndCosts = skinSourceAndCostLookup[cnSkin.skinId];
            if (!skinSourcesAndCosts) {
              console.warn(
                `Couldn't find skin source / cost info for: ${cnSkin.skinId}`
              );
            }
          }
          const enSkin = enSkinTable["charSkins"][cnSkin.skinId];
          let skinName;
          if (skinType === "skin") {
            skinName = `Skin: ${(enSkin ?? cnSkin).displaySkin.skinName}`;
          } else {
            skinName = `Elite ${elite ?? 0}`;
          }
          return {
            type: skinType,
            name: skinName,
            skinId: cnSkin.skinId,
            illustId: cnSkin.illustId,
            avatarId: cnSkin.avatarId,
            portraitId: cnSkin.portraitId,
            displaySkin: {
              modelName: cnSkin.displaySkin.modelName,
              drawerList: cnSkin.displaySkin.drawerList,
            },
            ...skinSourcesAndCosts,
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

  const operatorModulesLookup = aggregateModuleData();
  const { alterIdToBaseOpId, baseOpIdToAlterId } = getAlterMapping();

  const denormalizedOperators = denormalizedCharacters
    .filter((character) => character.profession !== "TOKEN")
    .map((character) => [
      character.charId,
      {
        ...character,
        ...releaseOrderAndLimitedLookup[character.cnName],
        summons: denormalizedSummons[character.charId] ?? [],
        modules: operatorModulesLookup[character.charId] ?? [],
        alterId: baseOpIdToAlterId[character.charId] ?? null,
        baseOperatorId: alterIdToBaseOpId[character.charId] ?? null,
        riicSkills: opToRiicSkillsMap[character.charId],
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
