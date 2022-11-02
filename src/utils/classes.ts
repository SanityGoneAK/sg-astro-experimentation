import branches from "../../data/branches.json";

const professionLookup: Record<string, string> = {
  Vanguard: "PIONEER",
  Guard: "WARRIOR",
  Specialist: "SPECIAL",
  Defender: "TANK",
  Supporter: "SUPPORT",
  Sniper: "SNIPER",
  Medic: "MEDIC",
  Caster: "CASTER",
};
const reverseProfessionLookup = Object.fromEntries(
  Object.entries(professionLookup).map(([k, v]) => [v, k])
);

export const classToProfession = (className: string): string =>
  professionLookup[className];

export const professionToClass = (profession: string): string =>
  reverseProfessionLookup[profession];

const subProfessionLookup: Record<string, string> = Object.fromEntries(
  Object.keys(branches).map((branch) => {
    return [branch, branches[branch as keyof typeof branches].branchName];
  })
);
const reverseSubProfessionLookup = Object.fromEntries(
  Object.entries(subProfessionLookup).map(([k, v]) => [v, k])
);
export const subProfessionIdToSubclass = (subProfessionId: string): string =>
  subProfessionLookup[subProfessionId];
export const subclassToSubProfessionId = (subclass: string): string =>
  reverseSubProfessionLookup[subclass];
