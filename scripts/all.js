import { promises as fs } from "fs";
import path from "path";

import { createOperatorsJson } from "./create-operators-json.js";
import { createBranchesJson } from "./create-branches-json.js";

const dataDir = path.join(__dirname, "../data");

(async () => {
  await fs.mkdir(dataDir, { recursive: true });
  await Promise.all([
    createOperatorsJson(dataDir),
    createBranchesJson(dataDir),
  ]);

  // unfortunately build-search-index depends on branches.json,
  // so we have to wait to import it until branches.json has been written
  const { buildSearchIndex } = await import("./build-search-index.js");
  console.log("Building search index...");
  await buildSearchIndex(dataDir);

  console.log("✅ Done.");
})();
