import { promises as fs } from "fs";
import path from "path";

import { items as cnItems } from "../ArknightsGameData/zh_CN/gamedata/excel/item_table.json";
import { items as enItems } from "../ArknightsGameData/en_US/gamedata/excel/item_table.json";

/**
 * Unofficial item name translations for items that exist in CN,
 * but have not yet been released in EN.
 *
 * These are only used if the official EN item name is missing.
 */
const UNOFFICIAL_ITEM_NAME_TRANSLATIONS = {
  30155: "Sintered Core Crystals",
  31063: "Transmuted Salt Cluster",
  31064: "Transmuted Salt Block",
};

/**
 * @param {string} itemId
 * @returns {boolean} whether to include this `itemId` in `items.json` or not
 */
function isItemWeCareAbout(itemId) {
  const entry = cnItems[itemId];
  return (
    itemId === "4001" || // LMD
    (entry.classifyType === "MATERIAL" &&
      !itemId.startsWith("p_char_") && // character-specific potential tokens
      !itemId.startsWith("tier") && // generic potential tokens
      !itemId.startsWith("voucher_full_")) // vouchers for event welfare ops like Flamebringer
  );
}

/**
 * Creates `{dataDir}/items.json`, a mapping of material `itemId`s to:
 * - `iconId` (needed for determining image paths)
 * - `name` (using unofficial English translations if needed)
 * - `rarity`
 *
 * This is basically a highly stripped down version of `item_table.json`.
 *
 * @param {string} dataDir - output directory
 */
export async function createItemsJson(dataDir) {
  console.log(`Creating ${path.join(dataDir, "items.json")}...`);
  const allItemIds = new Set([
    ...Object.keys(cnItems),
    ...Object.keys(enItems),
  ]);
  const allItemEntries = [...allItemIds]
    .filter((itemId) => isItemWeCareAbout(itemId))
    .map((itemId) => {
      const item = enItems[itemId] ?? cnItems[itemId];

      let name;
      if (enItems[itemId] != null) {
        name = enItems[itemId].name;
      } else if (UNOFFICIAL_ITEM_NAME_TRANSLATIONS[itemId] != null) {
        console.log("Using unofficial translation for item ID: " + itemId);
        name = UNOFFICIAL_ITEM_NAME_TRANSLATIONS[itemId];
      } else {
        console.warn("No translation available for item ID: " + itemId);
        name = cnItems[itemId].name;
      }

      return [
        itemId,
        {
          itemId,
          name,
          iconId: item.iconId,
          rarity: item.rarity,
        },
      ];
    });

  const itemsJson = Object.fromEntries(allItemEntries);
  await fs.writeFile(
    path.join(dataDir, "items.json"),
    JSON.stringify(itemsJson, null, 2)
  );
}
