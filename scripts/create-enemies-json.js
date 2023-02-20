import { promises as fs } from "fs";
import path from "path";

import enEnemyHb from "../ArknightsGameData/en_US/gamedata/excel/enemy_handbook_table.json";
import { enemies as enEnemyDb } from "../ArknightsGameData/en_US/gamedata/levels/enemydata/enemy_database.json";
import cnEnemyHb from "../ArknightsGameData/zh_CN/gamedata/excel/enemy_handbook_table.json";
import { enemies as cnEnemyDb } from "../ArknightsGameData/zh_CN/gamedata/levels/enemydata/enemy_database.json";

export async function createEnemiesJson(dataDir) {
  console.log(`Creating ${path.join(dataDir, "enemies.json")}...`);

  const enEnemyIds = Object.keys(enEnemyHb);
  const cnEnemyIds = Object.keys(cnEnemyHb);
  const allEnemies = new Set([...cnEnemyIds, ...enEnemyIds]);

  const allEnemyEntries = [...allEnemies].map((enemyId) => {
    const enemy = enEnemyHb[enemyId] ?? cnEnemyHb[enemyId];
    const isCnOnly = !enEnemyIds.includes(enemyId);
    const enemyInfo = isCnOnly
      ? cnEnemyDb.find((dbEntry) => dbEntry.Key == enemyId)
      : enEnemyDb.find((dbEntry) => dbEntry.Key == enemyId);

    const levels = enemyInfo.Value.map((value) => {
      return {
        level: value.level,
        attributes: value.enemyData.attributes,
        lifePointReduce: value.enemyData.lifePointReduce,
        levelType: value.enemyData.levelType,
        rangeRadius: value.enemyData.rangeRadius,
        numOfExtraDrops: value.enemyData.numOfExtraDrops,
        talentBlackboard: value.enemyData.talentBlackboard,
        skills: value.enemyData.skills,
        spData: value.enemyData.spData,
      };
    });

    return [
      enemyId,
      {
        enemyId: enemyId,
        enemyIndex: enemy.enemyIndex,
        enemyTags: enemy.enemyTags,
        name: enemy.name,
        enemyRace: enemy.enemyRace,
        enemyLevel: enemy.enemyLevel,
        description: enemy.description,
        attackType: enemy.attackType,
        endure: enemy.endure,
        attack: enemy.attack,
        defence: enemy.defence,
        resistance: enemy.resistance,
        ability: enemy.ability,
        levels: levels,
      },
    ];
  });

  const enemiesJson = Object.fromEntries(allEnemyEntries);

  await fs.writeFile(
    path.join(dataDir, "enemies.json"),
    JSON.stringify(enemiesJson, null, 2)
  );
}
