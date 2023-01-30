import type { InterpolatedValue } from "./description-parser";
import type { Range } from "./gamedata-types";
import type { RiicSkill } from "../scripts/aggregate-riic-data";

export type { SkinSource, SkinCostTokenType } from "../scripts/scrape-prts";
export type { RiicSkill } from "../scripts/aggregate-riic-data";

// This file contains the output types of our gamedata scripts - the game data after it's been
// processed by the scripts. These types do NOT fully conform to raw gamedata.

/**
 * Represents a single Arknights character (an operator or summon or something else).
 */
export interface Character {
  charId: string;
  name: string;
  cnName: string;
  profession: string;
  subProfessionId: string;
  position: string;
  description: string | null;
  phases: CharacterPhase[];
  rarity: number; // 1-indexed
  favorKeyFrames: FavorKeyFrame[] | null;
  potentialRanks: PotentialRanks[];
  talents: Talent[];
  skills: CharacterTableSkill[];
  allSkillLvlup: SkillLevelUpgrade[];
  skillData: SkillTableSkill[];
  [otherProperties: string]: unknown;
}

/**
 * Represents a single Arknights operator, which has some extra properties compared to a `Character`.
 */
export interface Operator extends Character {
  voices: Voice[];
  skins: Skin[];
  isLimited: boolean;
  releaseOrder: number; // lower value means released earlier
  summons: Character[];
  modules: Module[];
  /** The character ID of this operator's alter, or `null` if it doesn't have one. */
  alterId: string | null;
  /** The corresponding base operator's character ID if this operator is an alter, or `null` if this operator isn't an alter. */
  baseOperatorId: string | null;
  riicSkills: RiicSkill[];
}

/**
 * Represents an Arknights summon. Currently only has a single extra property: the operatorId of the operator that summons it.
 */
export interface Summon extends Character {
  operatorId: string;
}

/**
 * Represents a "phase" of an Arknights character (an operator or summon or something else).
 * At a specific phase, they might have different max levels, attribute keyframes, and ranges.
 */
interface CharacterPhase {
  characterPrefabKey: string;
  // character_table.json's "phases" objects have rangeIds,
  // but we expect this to be denormalized first
  range: Range;
  maxLevel: number;
  attributesKeyFrames: AttributeKeyFrame[];
  evolveCost: ItemCost[] | null;
  [otherProperties: string]: unknown;
}

/**
 * A given talent at a specific potential level.
 */
export interface TalentPhase {
  unlockCondition: {
    phase: number;
    level: number;
  };
  requiredPotentialRank: number;
  prefabKey: unknown; // unused
  /** Can be `null` for e.g. summon talents. */
  name: string | null;
  description: string | null;
  // this object only has rangeId,
  // but we'll expect that the range has been denormalized ahead of time
  range: Range | null;
  // this is the same format of interpolation object as is used in SkillInfo
  blackboard: InterpolatedValue[];
}

/**
 * A given talent at any of its "phases" (elite and potential improvements).
 */
export interface Talent {
  candidates: TalentPhase[];
}

/**
 * Represents the attributes/stats of a character at a given "key frame",
 * which is to say, a specific level and elite level.
 */
export interface AttributeKeyFrame {
  level: number;
  data: {
    maxHp: number;
    atk: number;
    def: number;
    baseAttackTime: number;
    magicResistance: number;
    cost: number;
    blockCnt: number;
    respawnTime: number;
    [otherProperties: string]: unknown;
  };
}

/**
 * Represents a "key frame" of what stats an operators gains at a certain level of
 * trust.
 */
export interface FavorKeyFrame {
  level: number;
  data: {
    maxHp: number;
    atk: number;
    def: number;
    magicResistance: number;
    [otherProperties: string]: unknown;
  };
}

/**
 * Represents the bonuses at each potential level for a character.
 * Used for potential dropdowns and anything else that needs to know how potentials
 * affect a specific character.
 */
export interface PotentialRanks {
  buff: {
    attributes: {
      attributeModifiers: {
        attributeType: number;
        value: number;
      }[];
    };
  } | null;
  type: number;
  description: string;
  equivalentCost: unknown; // unused
}

export enum SkillType {
  "Passive" = 0,
  "Manual Trigger",
  "Auto Trigger",
}

export enum SkillSpType {
  "Per Second Recovery" = 1,
  "Offensive Recovery",
  "UNUSED",
  "Defensive Recovery",
}

/**
 * Represents a skill's information at a specific skill level.
 */
interface SkillLevel {
  name: string;
  description: string | null;
  // SkillLevelObject only has rangeId (of type string) in the game data,
  // but we expect it to be denormalized into a RangeObject before being passed to <SkillInfo />
  range: Range | null;
  skillType: SkillType;
  spData: {
    spType: SkillSpType;
    spCost: number;
    initSp: number;
    levelUpCost: unknown; // unused
    maxChargeTime: unknown; // unused
    increment: unknown; // unused
  };
  duration: number;
  // "blackboard" is used for interpolating formatted numeric values into the description,
  // e.g. "gains ATK <@ba.vup>+{atk:0%}</>, <@ba.vup>reduced</> attack interval, DEF <@ba.vup>+{def:0%}</>, ..."
  // references blackboard.atk, blackboard.def and is formatted to
  // "gains ATK +140%, reduced attack interval, DEF +80%, ..." with blue text for the interpolated values
  blackboard: InterpolatedValue[];
  prefabId: unknown; // unused
}

/** Represents a single object in the `skills` array of a given `character_table.json` entry. */
export interface CharacterTableSkill {
  skillId: string | null;
  levelUpCostCond: MasteryUpgrade[];
  unlockCond: {
    phase: number;
    level: number;
  };
  [otherProperties: string]: unknown;
}

/**
 * Represents an operator skill. Importantly, this is the object taken from `skill_table.json`,
 * **not** the `skills` property on a given `character_table.json` entry.
 */
export interface SkillTableSkill {
  skillId: string;
  iconId: string | null;
  levels: SkillLevel[];
  [otherProperties: string]: unknown;
}

export interface MasteryUpgrade {
  unlockCond: {
    phase: number;
    level: number;
  };
  lvlUpTime: number;
  /** Can be null for e.g. summon skills. */
  levelUpCost: ItemCost[] | null;
}

export interface SkillLevelUpgrade {
  unlockCond: {
    phase: number;
    level: number;
  };
  /** Can be null for e.g. summon skills. */
  lvlUpCost: ItemCost[] | null;
}

export interface ItemCost {
  id: string;
  count: number;
  /** just `type`, which seems to always be `"MATERIAL"`, so very not useful*/
  [otherProperties: string]: unknown;
}

/**
 * Represents an operator module.
 */
export interface Module {
  moduleId: string;
  /** e.g. "CHA-X", "CHA-Y" */
  moduleIcon: string;
  moduleName: string;
  phases: ModulePhase;
}

/**
 * Represents an operator module at a specific module level.
 */
type ModulePhase = Array<{
  candidates: ModulePhaseCandidate[];
}>;

/**
 * Represents an operator module at a specific module level *and* operator potential.
 */
export interface ModulePhaseCandidate {
  traitEffect: string | null;
  /** Either `"update"` or `"override"`. */
  traitEffectType: string;
  talentEffect: string | null;
  talentIndex: number;
  displayRange: boolean;
  range: Range | null;
  attributeBlackboard: InterpolatedValue[];
  requiredPotentialRank: number; // 0-indexed
  /**
   * Stat changes for this operator's summons if they equip this module.
   * Is an empty object if the operator has no summons, or if the module doesn't affect their stats.
   */
  tokenAttributeBlackboard: {
    [summonCharacterId: string]: InterpolatedValue[];
  };
}

interface Voice {
  wordkey: string;
  voiceLangType: string;
  cvName: string[];
}

interface BaseOperatorSkin {
  skinId: string;
  illustId: string;
  avatarId: string;
  portraitId: string;
  displaySkin: {
    modelName: string;
    drawerList: string[];
  };
}

/**
 * Default Elite 0/1/2 operator art.
 */
interface DefaultOperatorSkin extends BaseOperatorSkin {
  displaySkin: {
    skinName: null;
    modelName: string;
    drawerList: string[];
  };
}

/**
 * Any other custom operator skin.
 */
interface SpecialOperatorSkin extends BaseOperatorSkin {
  displaySkin: {
    skinName: string;
    modelName: string;
    drawerList: string[];
  };
  /** @see `SkinSource` */
  obtainSources: string[];
  cost: number | null;
  /** @see `SkinCostTokenType` */
  tokenType: string | null;
}

export type Skin = DefaultOperatorSkin | SpecialOperatorSkin;

export type SearchResult =
  | OperatorSearchResult
  | ClassSearchResult
  | BranchSearchResult;

interface OperatorSearchResult {
  type: "operator";
  charId: string;
  name: string;
  class: string;
  subclass: string;
  rarity: number;
}

interface ClassSearchResult {
  type: "class";
  name: string;
  class: string;
}

interface BranchSearchResult {
  type: "branch";
  name: string;
  class: string;
  subProfession: string;
}

export interface StageInfo {
  stageId: string;
  stageType: string;
  difficulty: string;
  levelId: string;
  zoneId: string;
  code: string;
  hardStagedId: string;
  mainStageId: string;
  isCnOnly: boolean;
}

export interface StageData {
  options: {
    characterLimit: number;
    maxLifePoint: number;
    initialCost: number;
    maxCost: number;
    costIncreaseTime: number;
    moveMultiplier: number;
    steeringEnabled: boolean;
    isTrainingLevel: boolean;
    functionDisableMask: number;
  };
  levelId: string;
  mapId: string;
  bgmEvent: string;
  mapData: MapData;
  [otherProperties: string]: unknown;
}

interface MapData {
  map: number[][];
  tiles: Tile[];
  width: number;
  height: number;
  [otherProperties: string]: unknown;
}

interface Tile {
  tileKey: string;
  heightType: number;
  buildableType: number;
  passableMask: number;
  [otherProperties: string]: unknown;
}

export interface DraggableCharacter {
  row: number | null;
  col: number | null;
  charId: string;
  characterObject: Character;
}