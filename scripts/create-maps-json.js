import { promises as fs } from "fs";
import path from "path";

import { stages as enMaps } from "../ArknightsGameData/en_US/gamedata/excel/stage_table.json";
import { stages as cnMaps } from "../ArknightsGameData/zh_CN/gamedata/excel/stage_table.json";
// import { levelScenePairs } from "../ArknightsGameData/zh_CN/gamedata/battle/battle_misc_table.json";

// Some easy/though or activitie stages don't have an actual json file but rely on an already existing map
// function getCorrectLevelId(levelId) {
//   return levelScenePairs[levelId] ? levelScenePairs[levelId].levelId : levelId;
// }

/**
 *
 * @param {string} dataDir - output directory
 */
export async function createMapsJson(dataDir) {
  console.log(`Creating ${path.join(dataDir, "maps.json")}...`);

  const levelIdBlackList = ["Activities/ACT4D0/level_act4d0_05"];

  const enStageIds = Object.keys(enMaps);
  const cnStageIds = Object.keys(cnMaps);
  const allStages = new Set([...cnStageIds, ...enStageIds]);
  await fs.mkdir(path.join(dataDir, "/maps"), { recursive: true });

  const allStageEntries = [...allStages].map((stageId) => {
    const stage = enMaps[stageId] ?? cnMaps[stageId];
    const isCnOnly = !enStageIds.includes(stageId);

    // if (stage.levelId && !levelIdBlackList.includes[stage.levelId]) {
    //   try {
    //     const levelData = await import(
    //       "../ArknightsGameData/" +
    //         locale +
    //         "/gamedata/levels/" +
    //         getCorrectLevelId(stage.levelId).toLowerCase() +
    //         ".json"
    //     );

    //     await fs.writeFile(
    //       path.join(dataDir, "maps/" + stageId + ".json"),
    //       JSON.stringify(levelData, null, 2)
    //     );
    //   } catch (error) {
    //     console.log("error in " + stage.levelId);
    //     console.log(error);
    //   }
    // }

    return [
      stageId,
      {
        stageId,
        stageType: stage.stageType,
        difficulty: stage.difficulty,
        levelId: stage.levelId,
        zoneId: stage.zoneId,
        code: stage.code,
        hardStagedId: stage.hardStagedId,
        mainStageId: stage.mainStageId,
        isCnOnly,
      },
    ];
  });

  const stagesJson = Object.fromEntries(allStageEntries);
  console.log(allStageEntries);

  await fs.writeFile(
    path.join(dataDir, "maps.json"),
    JSON.stringify(stagesJson, null, 2)
  );
}
