import { load } from "cheerio";
import axios from "axios";
import cnCharTableJson from "../ArknightsGameData/zh_CN/gamedata/excel/character_table.json";

const GAMEPRESS_ARKNIGHTS_OPERATOR_LIST_URL =
  "https://gamepress.gg/arknights/tools/interactive-operator-list";

const _charIdRegex = /^char_(?<id>[^_]+)_/;

const _idToCharIdLookup = Object.fromEntries(
  Object.keys(cnCharTableJson).map((charId) => {
    const match = charId.match(_charIdRegex);
    if (!match?.groups) {
      return [];
    }
    const { id } = match.groups;
    return [id, charId];
  })
);

function idToCharId(id: string, name: string) {
  if (id.match(_charIdRegex)) {
    return id;
  }
  if (id === "1001" && name === "Amiya (Guard)") {
    return "char_1001_amiya2";
  }
  const charId = _idToCharIdLookup[id];
  if (!charId) {
    console.error(
      `Couldn't find full character ID for id: ${id}, name: ${name}`
    );
  }
  return charId;
}

export async function getOperatorReleaseOrderAndLimitedOperators() {
  const res = await axios.get(GAMEPRESS_ARKNIGHTS_OPERATOR_LIST_URL);
  const $ = load(res.data);

  // rows with data-id="" indicate unreleased operators
  const allOperators = $("tr.operators-row:not([data-id=''])");

  const limitedOperatorIdSet = new Set<string>(
    allOperators
      // the result of filtering the list for just Limited operators
      .filter($("[data-ability-tags*='13151']"))
      .toArray()
      .map((e) => idToCharId(e.attribs["data-id"], e.attribs["data-name"]))
  );

  const operatorIdsNewestToOldest: string[] = allOperators
    .toArray()
    .sort(
      (a, b) =>
        Number(b.attribs["data-created"]) - Number(a.attribs["data-created"])
    )
    .map((e) => idToCharId(e.attribs["data-id"], e.attribs["data-name"]));

  return {
    limitedOperatorIdSet,
    operatorIdsNewestToOldest,
  };
}
