import cnBattleEquipTable from "../ArknightsGameData/zh_CN/gamedata/excel/battle_equip_table.json";
import cnUniequipTable from "../ArknightsGameData/zh_CN/gamedata/excel/uniequip_table.json";
import enBattleEquipTable from "../ArknightsGameData/en_US/gamedata/excel/battle_equip_table.json";
import enUniequipTable from "../ArknightsGameData/en_US/gamedata/excel/uniequip_table.json";
import moduleTranslations from "./translations/module-tls.json";
import rangeTable from "../ArknightsGameData/zh_CN/gamedata/excel/range_table.json";

import { descriptionToHtml } from "../src/description-parser";
/**
 * @typedef { import("../src/output-types.js").Module } Module
 * @typedef { import("../src/output-types.js").ModulePhaseCandidate } ModulePhase
 */

// Module data is scattered across the following files:
// - gamedata/excel/battle_equip_table.json
// - gamedata/excel/uniequip_table.json
//
// In addition, since some modules modify operator ranges, we also need to access
// - gamedata/excel/range_table.json
//
// And further, if we want to provide English translations for modules
// that haven't been released yet in the English version, we also need
// to override module names/descriptions/effects by reading from
// - ./translations/module-tls.json

/**
 * Aggregates module data from battle_equip_table and uniequip_table,
 * denormalizes module ranges, and applies unofficial English translations.
 *
 * Returns a mapping of operatorId to an array of that operator's modules.
 *
 * @returns {{ [operatorId: string]: Module[] }}
 */
export function aggregateModuleData() {
  /** @type {{ [operatorId: string]: Module[] }} */
  const moduleData = {};

  Object.entries(cnBattleEquipTable).forEach(([moduleId, cnBattleEquip]) => {
    const operatorId = cnUniequipTable.equipDict[moduleId].charId;
    const operatorBattleEquip = { ...cnBattleEquip };

    // get icon of module's type (like EXE-Y or SUM-X)
    const { typeName1, typeName2 } = cnUniequipTable.equipDict[moduleId];
    const moduleIcon = `${typeName1}-${typeName2}`;

    // module name:
    // - use EN if it's there
    // - otherwise try to use unofficial TL
    // - fall back to CN
    let moduleName = cnUniequipTable.equipDict[moduleId].uniEquipName;
    if (moduleId in enUniequipTable.equipDict) {
      moduleName = enUniequipTable.equipDict[moduleId].uniEquipName;
    } else if (
      moduleId in moduleTranslations &&
      moduleTranslations[moduleId].moduleName
    ) {
      moduleName = moduleTranslations[moduleId].moduleName;
    }

    // Use EN data for module phases if:
    // - the module is available in EN
    // - the phases match in size
    if (
      moduleId in enBattleEquipTable &&
      cnBattleEquip.phases.length === enBattleEquipTable[moduleId].phases.length
    ) {
      for (let i = 0; i < cnBattleEquip.phases.length; i++) {
        operatorBattleEquip.phases[i] = enBattleEquipTable[moduleId].phases[i];
      }
    }

    /** @type {Module["phases"]} */
    const phases = [];

    operatorBattleEquip.phases.forEach((currentPhase, i) => {
      /** @type {{ [potential: number | string]: ModulePhase }} */
      const candidates = {};

      // We loop through 0-5 to check each possible potential rank.
      // If that potential rank exists within the list of potential candidates
      // for a module, we push it to an object with the potentials as keys.
      // This is to facilitate easier editing of the current phase's data by
      // potential in the next step. Candidates will be converted into an array
      // later on, with earlier potentials coming first.
      for (let j = 0; j < 6; j++) {
        // check which requiredPotentialRanks exist
        let potentialExists = false;
        for (let k = 0; k < currentPhase.parts.length; k++) {
          if (
            currentPhase.parts[k].overrideTraitDataBundle.candidates !== null
          ) {
            for (
              let l = 0;
              l <
              currentPhase.parts[k].overrideTraitDataBundle.candidates.length;
              l++
            ) {
              if (
                currentPhase.parts[k].overrideTraitDataBundle.candidates[l]
                  .requiredPotentialRank === j
              ) {
                potentialExists = true;
              }
            }
          }
          if (
            currentPhase.parts[k].addOrOverrideTalentDataBundle.candidates !==
            null
          ) {
            for (
              let l = 0;
              l <
              currentPhase.parts[k].addOrOverrideTalentDataBundle.candidates
                .length;
              l++
            ) {
              if (
                currentPhase.parts[k].addOrOverrideTalentDataBundle.candidates[
                  l
                ].requiredPotentialRank === j
              ) {
                potentialExists = true;
              }
            }
          }
        }

        // push a new (default values) entry to the candidates object
        if (potentialExists) {
          candidates[j] = {
            attributeBlackboard: currentPhase.attributeBlackboard,
            displayRange: false,
            range: null,
            requiredPotentialRank: j,
            talentEffect: null,
            talentIndex: -1,
            traitEffect: null,
            traitEffectType: "",
            tokenAttributeBlackboard: currentPhase.tokenAttributeBlackboard,
          };
        }
      }

      // This is the heavy lifting. Based on the target string of this particular candidate,
      // we determine the changes that need to be made to a certain potential in candidates{}.
      for (let j = 0; j < currentPhase.parts.length; j++) {
        const curPart = currentPhase.parts[j];
        const target = curPart.target;

        // There are 2 data bundles in the candidate:
        // addOrOverrideTalentDataBundle and overrideTraitDataBundle.
        // Only one will ever be present, depending on what the target is set to.

        // TRAIT, TRAIT_DATA_ONLY, and DISPLAY mean the trait is being modified
        // (and we're using overrideTraitDataBundle).
        // in some way. DISPLAY usually means the stats aren't affected (I think).
        // We can handle them all together.
        if (
          target === "TRAIT" ||
          target === "TRAIT_DATA_ONLY" ||
          target === "DISPLAY"
        ) {
          if (curPart.overrideTraitDataBundle.candidates === null) {
            // if we ever get here, HG has messed up big time
            console.error(
              `overrideTraitDataBundle is null on ${moduleId}. This should NOT happen`
            );
            continue;
          }

          const traitCandidates = curPart.overrideTraitDataBundle.candidates;

          // sigh... we're in another candidates array
          for (let k = 0; k < traitCandidates.length; k++) {
            const curTraitCandidate = traitCandidates[k];

            // additionalDescription will supplement the trait with new text in
            // a newline, while overrideDescripton [sic] will completely overwrite
            // the trait.

            // Confoundingly, both additionalDescription and overrideDescripton
            // can be present at the same time, but it only occurs on AoE casters.
            // Why? I really don't know. Either way, if they are both present,
            // we can ignore the overrideDescription because it will say
            // "this unit deals AoE damage".
            if (curTraitCandidate.additionalDescription) {
              candidates[curTraitCandidate.requiredPotentialRank].traitEffect =
                descriptionToHtml(
                  curTraitCandidate.additionalDescription,
                  curTraitCandidate.blackboard
                );
              // this is a trait UPDATE
              candidates[
                curTraitCandidate.requiredPotentialRank
              ].traitEffectType = "update";
            } else if (curTraitCandidate.overrideDescripton) {
              candidates[curTraitCandidate.requiredPotentialRank].traitEffect =
                descriptionToHtml(
                  curTraitCandidate.overrideDescripton,
                  curTraitCandidate.blackboard
                );
              // the trait is being OVERRIDDEN
              candidates[
                curTraitCandidate.requiredPotentialRank
              ].traitEffectType = "override";
            }
          }
        } else if (target === "TALENT" || target === "TALENT_DATA_ONLY") {
          // If the target is TALENT or TALENT_DATA_ONLY, that means either
          // a talent has been changed, or this module modifies range. (I don't know
          // why that's considered a talent... but whatever.)
          // If this modifies range, the target will be TALENT.
          if (curPart.addOrOverrideTalentDataBundle.candidates === null) {
            console.error(
              `addOrOverrideTalentDataBundle is null on ${moduleId}. This should NOT happen`
            );
            continue;
          }

          const talentCandidates =
            curPart.addOrOverrideTalentDataBundle.candidates;

          // oh boy another one
          for (let k = 0; k < talentCandidates.length; k++) {
            const curTalentCandidate = talentCandidates[k];

            // If displayRangeId is true, this module modifies range,
            // meaning rangeId exists (as a string, not a RangeObject).
            // We denormalize it using the range table and then save it.
            if (curTalentCandidate.displayRangeId) {
              candidates[curTalentCandidate.requiredPotentialRank].range =
                rangeTable[curTalentCandidate.rangeId];
              candidates[
                curTalentCandidate.requiredPotentialRank
              ].displayRange = true;
            }
            // upgradeDescription is always a direct override of the talent
            // (it will completely replace the old text, not a newline).
            // talentIndex is a 0-indexed number that represents the talent being
            // overridden... however, it can also be -1 in the case that
            // upgradeDescription is actually a completely new talent
            // (or upgradeDescription is null...)
            if (curTalentCandidate.upgradeDescription) {
              candidates[
                curTalentCandidate.requiredPotentialRank
              ].talentEffect = descriptionToHtml(
                curTalentCandidate.upgradeDescription,
                curTalentCandidate.blackboard
              );
              candidates[curTalentCandidate.requiredPotentialRank].talentIndex =
                curTalentCandidate.talentIndex;
            }
          }
        }
      }

      // When the requiredPotentialRank (zero-indexed) is not 0, the module data
      // for some reason doesn't include the effect data from earlier phases
      // (that is obviously still in effect). This fixes any missing
      // trait/talent effects, ranges, or effect types ("UPDATE" vs "OVERRIDE").
      Object.values(candidates).forEach((candidate) => {
        if (candidate.requiredPotentialRank !== 0) {
          if (!candidate.traitEffect) {
            candidate.traitEffect = candidates[0].traitEffect;
          }
          if (!candidate.talentEffect) {
            candidate.talentEffect = candidates[0].talentEffect;
            candidate.talentIndex = candidates[0].talentIndex;
          }
          if (!candidate.traitEffectType) {
            candidate.traitEffectType = candidates[0].traitEffectType;
          }
          if (!candidate.displayRange && candidates[0].displayRange) {
            candidate.displayRange = true;
            candidate.range = candidates[0].range;
          }
        }
      });

      // Check the translations. If they exist, replace the existing effects
      // with what's specified in the translation. The rest of the data doesn't
      // need to be translated, so it's directly used (thus, translations have
      // a very different format from the module data file).
      if (moduleId in moduleTranslations) {
        for (let j = 0; j < moduleTranslations[moduleId].phases.length; j++) {
          // Check if official EN translation exists. If it does, ignore the translation.
          if (moduleId in enBattleEquipTable) {
            // amount of phases is more than the current phase
            if (enBattleEquipTable[moduleId].phases.length > j) {
              continue;
            }
          }
          if (
            candidates[
              moduleTranslations[moduleId].phases[j].requiredPotentialRank
            ]
          ) {
            candidates[
              moduleTranslations[moduleId].phases[j].requiredPotentialRank
            ].traitEffect =
              moduleTranslations[moduleId].phases[j].translations[i].trait;
            candidates[
              moduleTranslations[moduleId].phases[j].requiredPotentialRank
            ].talentEffect =
              moduleTranslations[moduleId].phases[j].translations[i].talent;
          }
        }
      }

      // Transform candidates back into an array
      phases.push({
        candidates: Object.values(candidates),
      });

      // Quick and dirty regular expression for any Chinese characters to log
      // any missing translations.
      if (
        (candidates[0].talentEffect &&
          /[\u4e00-\u9FFF]/g.test(candidates[0].talentEffect)) ||
        (candidates[0].traitEffect &&
          /[\u4e00-\u9FFF]/g.test(candidates[0].traitEffect))
      ) {
        console.warn(
          `No module translation found for ${moduleId} phase ${i + 1}`
        );
      }
    });

    // now we're ready to add this to `moduleData`
    const operatorModules = [
      ...(moduleData[operatorId] ?? []),
      {
        moduleId,
        moduleIcon,
        moduleName,
        phases,
      },
    ];
    // sort e.g. "CHA-X" before "CHA-Y"
    operatorModules.sort((a, b) => a.moduleIcon.localeCompare(b.moduleIcon));
    moduleData[operatorId] = operatorModules;
  });

  return moduleData;
}
