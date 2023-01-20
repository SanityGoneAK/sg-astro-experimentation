import type { InterpolatedValue } from "./description-parser";
import type { Range } from "./gamedata-types";

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
  skillData: Skill[];
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
  name: string;
  description: string;
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

enum SkillType {
  "Passive" = 0,
  "Manual Trigger",
  "Auto Trigger",
}

enum SkillSpType {
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
  description: string;
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

/**
 * Represents an operator skill. (Or the skill of an inanimate object, who knows.)
 */
export interface Skill {
  skillId: string;
  iconId: string | null;
  levels: SkillLevel[];
  [otherProperties: string]: unknown;
}

/**
 * Represents a module of an operator at all stages.
 */
export interface Module {
  moduleId: string;
  moduleIcon: string;
  moduleName: string;
  phases: {
    candidates: ModulePhase[];
  }[];
}

/**
 * Represents a module of an operator at a specific stage AND potential.
 */
export interface ModulePhase {
  traitEffect: string | null;
  traitEffectType: string; // "update" or "override"
  talentEffect: string | null;
  talentIndex: number;
  displayRange: boolean;
  range: Range | null;
  attributeBlackboard: InterpolatedValue[];
  requiredPotentialRank: number; // 0-indexed
}

interface Voice {
  wordkey: string;
  voiceLangType: string;
  cvName: string[];
}

interface Skin {
  skinId: string;
  illustId: string;
  avatarId: string;
  portraitId: string;
  displaySkin: {
    skinName: string;
    modelName: string;
    drawerList: string[];
  };
}

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
