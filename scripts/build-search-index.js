import FlexSearch from "flexsearch";
import { promises as fs } from "fs";
import path from "path";

import { professionToClass } from "../src/utils/classes";
import { subProfessionIdToBranch } from "../src/utils/branches";
import { fetchContentfulGraphQl } from "../src/utils/fetch";

import operatorsJson from "../data/operators.json";
import branchesJson from "../data/branches.json";

/** @typedef {import("../src/output-types").SearchResult} SearchResult */

/**
 * Creates `{dataDir}/search.json`, a FlexSearch index used for Sanity;Gone's search bar.
 *
 * @param {string} dataDir - output directory
 */
export async function buildSearchIndex(dataDir) {
  /** @type {SearchResult[]} */
  const searchArray = [];
  /** @type {Record<string, SearchResult>} */
  const searchStore = {};

  Object.values(operatorsJson)
    .filter((e) => !e.isNotObtainable)
    .forEach((op) => {
      searchArray.push({
        type: "operator",
        charId: op.charId,
        name: op.name,
        class: professionToClass(op.profession),
        subclass: subProfessionIdToBranch(op.subProfessionId),
        rarity: op.rarity,
      });
    });
  [
    "Vanguard",
    "Guard",
    "Specialist",
    "Defender",
    "Supporter",
    "Sniper",
    "Medic",
    "Caster",
  ].forEach((className) => {
    searchArray.push({
      type: "class",
      name: className,
      class: className,
    });
  });
  Object.entries(branchesJson).forEach(([branchName, branch]) => {
    searchArray.push({
      type: "branch",
      name: branch.branchName,
      class: branch.class,
      subProfession: branchName,
    });
  });
  searchArray.forEach((value, i) => {
    searchStore[i] = value;
  });

  const index = FlexSearch.create({
    tokenize: "full",
  });

  Object.entries(searchStore).forEach(([key, value]) => {
    index.add(+key, value.name);
  });

  const contentfulQuery = `
  query {
    operatorAnalysisCollection {
      items {
        operator {
          name
          slug
        }
      }
    }
  }
  `;
  /** @type any */
  const { operatorAnalysisCollection } = await fetchContentfulGraphQl(
    contentfulQuery
  );

  const operatorsWithGuides = Object.fromEntries(
    operatorAnalysisCollection.items.map((item) => [
      item.operator.name,
      item.operator.slug,
    ])
  );

  await fs.writeFile(
    path.join(dataDir, "search.json"),
    JSON.stringify(
      {
        index: index.export(),
        store: searchStore,
        operatorsWithGuides,
      },
      null,
      2
    )
  );
}
