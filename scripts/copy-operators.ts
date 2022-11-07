import fs from "fs";
import path from "path";
import enCharacterTable from "../ArknightsGameData/en_US/gamedata/excel/character_table.json";
import { patchChars as enPatchChars } from "../ArknightsGameData/en_US/gamedata/excel/char_patch_table.json";
import cnCharacterTable from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";
import enSkillTable from "../ArknightsGameData/en_US/gamedata/excel/skill_table.json";
import cnSkillTable from "../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json";
import rangeTable from "../ArknightsGameData/zh_CN/gamedata/excel/range_table.json";
import jetSkillTranslations from "./translations/jet/skills.json";
import jetTalentTranslations from "./translations/jet/talents.json";
import { fixJetSkillDescriptionTags } from "./fix-jet-skill-descs";

import type * as GameData from "../src/gamedata-types";
import type { InterpolatedValue } from "../src/description-parser";

const dataDir = path.join(__dirname, "../data");
fs.mkdirSync(dataDir, { recursive: true });

const NAME_OVERRIDES: { [characterId: string]: string } = {
  char_376_therex: "Thermal-EX",
  char_1001_amiya2: "Amiya (Guard)",
};

// I CBA to fix this typing
// so I will just whack this here
interface DenormalizedCharacter extends GameData.SharedProperties {
  charId: string;
  isCnOnly: boolean;
  phases: {
    range: Range | null;
    [otherProperties: string]: unknown;
  }[];
  talents:
    | {
        candidates: {
          range: Range | null;
          name: string;
          description: string;
        }[];
      }[]
    | null;
  fileIndex: number;
}

interface SkillAtLevel {
  name: string;
  description: string | null;
  rangeId: string | null;
  duration: number;
  blackboard: InterpolatedValue[];
}

void (async () => {
  console.log("Updating operators and summons...");
  const enCharacterIds = new Set(Object.keys(enCharacterTable));
  const cnOnlyCharacters = Object.entries(cnCharacterTable).filter(
    ([charId]) => !enCharacterIds.has(charId)
  );

  const summonIdToOperatorName: Record<string, string> = {};
  // @ts-expect-error bro
  const denormalizedCharacters: DenormalizedCharacter[] = (
    [
      ...Object.entries(enCharacterTable),
      ...cnOnlyCharacters,
      ...Object.entries(enPatchChars),
    ] as [string, GameData.Character][]
  )
    .filter(
      ([_, character]) =>
        character.profession !== "TRAP" && !character.isNotObtainable
    )
    .map(([charId, character], i) => {
      const isCnOnly = !enCharacterIds.has(charId);
      const characterName =
        NAME_OVERRIDES[charId] ??
        (isCnOnly ? character.appellation : character.name);

      character.skills
        .filter((skill) => skill.overrideTokenKey != null)
        .forEach((skill) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          summonIdToOperatorName[skill.overrideTokenKey!] = characterName;
        });

      const phases = character.phases.map((phase) => ({
        ...phase,
        range: phase.rangeId
          ? rangeTable[phase.rangeId as keyof typeof rangeTable]
          : null,
      }));

      const talents = (character.talents || []).map((talent, talentIndex) => {
        const candidates = (talent.candidates || []).map(
          (candidate, phaseIndex) => {
            const baseCandidateObject = {
              ...candidate,
              range: candidate.rangeId
                ? rangeTable[candidate.rangeId as keyof typeof rangeTable]
                : null,
            };
            if (isCnOnly && character.profession !== "TOKEN") {
              try {
                const talentTL =
                  jetTalentTranslations[
                    charId as keyof typeof jetTalentTranslations
                  ][talentIndex][phaseIndex];
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const skillId = skill.skillId!;
          const baseSkillObject = isCnOnly
            ? cnSkillTable[skillId as keyof typeof cnSkillTable]
            : enSkillTable[skillId as keyof typeof enSkillTable];

          // @ts-expect-error idk what TS is doing, this doesn't error on the old repo
          const levels = baseSkillObject.levels.map(
            (skillAtLevel: SkillAtLevel, levelIndex: number) => {
              const baseSkillLevelObject = {
                ...skillAtLevel,
                range: skillAtLevel.rangeId
                  ? rangeTable[skillAtLevel.rangeId as keyof typeof rangeTable]
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
                  const skillTL =
                    jetSkillTranslations[
                      skillId as keyof typeof jetSkillTranslations
                    ];
                  baseSkillLevelObject.name = skillTL.name;
                  baseSkillLevelObject.description = fixJetSkillDescriptionTags(
                    skillTL.desc[levelIndex]
                  );
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
            // @ts-expect-error go figure
            ...baseSkillObject,
            levels,
          };
        })
        .filter((skillData) => !!skillData);

      const mostRecentCharData =
        cnCharacterTable[charId as keyof typeof cnCharacterTable] ??
        enPatchChars[charId as keyof typeof enPatchChars];
      const { name: cnName, subProfessionId } = mostRecentCharData;

      if (character.tokenKey) {
        summonIdToOperatorName[character.tokenKey] = characterName;
      }

      return {
        ...character,
        charId,
        phases,
        talents,
        skillData,
        cnName,
        subProfessionId,
        name: characterName,
        isCnOnly,
        fileIndex: i,
      };
    });

  const denormalizedOperators = denormalizedCharacters.filter(
    (character) => character.profession !== "TOKEN"
  );
  const operatorsJson = Object.fromEntries(
    denormalizedOperators
      .map(
        (character) =>
          [character.name, character] as [string, DenormalizedCharacter]
      )
      .sort(([_, charA], [__, charB]) => {
        // sort by descending rarity and descending fileIndex
        return charB.rarity - charA.rarity || charB.fileIndex - charA.fileIndex;
      })
  );
  fs.writeFileSync(
    path.join(dataDir, "operators.json"),
    JSON.stringify(operatorsJson, null, 2)
  );

  const denormalizedSummons = denormalizedCharacters
    .filter((character) => character.profession === "TOKEN")
    .map((summon) => ({
      ...summon,
      operatorName: summonIdToOperatorName[summon.charId],
    }));
  const summonsJson = denormalizedSummons.reduce((allSummons, summon) => {
    if (allSummons[summon.operatorName] != null) {
      allSummons[summon.operatorName].push(summon);
    } else {
      allSummons[summon.operatorName] = [summon];
    }
    return allSummons;
  }, {} as Record<string, DenormalizedCharacter[]>);
  fs.writeFileSync(
    path.join(dataDir, "summons.json"),
    JSON.stringify(summonsJson, null, 2)
  );
})();