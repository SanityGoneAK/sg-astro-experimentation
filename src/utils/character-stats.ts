import type { Range } from "../gamedata-types";
import type * as OutputTypes from "../output-types";

/**
 * Represents a set of stat values for a character.
 */
export interface CharacterStatValues {
  health: number;
  attackPower: number;
  defense: number;
  artsResistance: number;
  dpCost: number;
  blockCount: number;
  redeployTimeInSeconds: number;
  secondsPerAttack: number;
  rangeObject: Range;
}

/**
 * Represents the stat changes of a potential at each potential level.
 */
export interface PotentialStatChange {
  health: number;
  attackPower: number;
  defense: number;
  artsResistance: number;
  dpCost: number;
  attackSpeed: number;
  redeployTimeInSeconds: number;
  description: string | null;
}

export const doStatsChange = (
  characterObject: OutputTypes.Character
): boolean => {
  const { phases } = characterObject;
  const activePhase = phases[phases.length - 1];

  const startingKeyFrame = activePhase.attributesKeyFrames[0];
  const finalKeyFrame =
    activePhase.attributesKeyFrames[activePhase.attributesKeyFrames.length - 1];

  return (
    JSON.stringify(startingKeyFrame.data) !== JSON.stringify(finalKeyFrame.data)
  );
};

export const getStatsAtLevel = (
  characterObject: OutputTypes.Character,
  values: {
    eliteLevel: number;
    level: number;
    trust: boolean;
    pots: boolean;
  }
): CharacterStatValues => {
  const { eliteLevel, level, trust, pots } = values;

  const { phases } = characterObject;
  const activePhase = phases[eliteLevel];
  const maxLevel = activePhase.maxLevel;

  const { range: rangeObject } = activePhase;

  const startingKeyFrame = activePhase.attributesKeyFrames[0];
  const finalKeyFrame =
    activePhase.attributesKeyFrames[activePhase.attributesKeyFrames.length - 1];

  const {
    maxHp,
    atk,
    def,
    magicResistance: res,
    cost: dp,
    blockCnt: blockCount,
    respawnTime: redeploy,
    baseAttackTime,
  } = startingKeyFrame.data;

  const {
    maxHp: finalMaxHp,
    atk: finalMaxAtk,
    def: finalMaxDef,
    magicResistance: finalMaxRes,
  } = finalKeyFrame.data;

  const {
    maxHp: trustHp,
    atk: trustAtk,
    def: trustDef,
    magicResistance: trustRes,
  } = trust
    ? getMaxTrustStatIncrease(characterObject)
    : {
        maxHp: 0,
        atk: 0,
        def: 0,
        magicResistance: 0,
      }; // pass 0 to everything if trust is off to avoid weird errors with summons

  const {
    health: potHealth,
    attackPower: potAttack,
    defense: potDefense,
    artsResistance: potRes,
    attackSpeed: potASPD,
    dpCost: potDp,
    redeployTimeInSeconds: potRedeploy,
  } = pots
    ? getMaxPotStatIncrease(characterObject)
    : {
        health: 0,
        attackPower: 0,
        defense: 0,
        artsResistance: 0,
        attackSpeed: 0,
        dpCost: 0,
        redeployTimeInSeconds: 0,
      };

  // apply trust-based and potential-based transforms
  const health =
    linearInterpolate(level, maxLevel, maxHp, finalMaxHp) +
    (trust ? trustHp : 0) +
    potHealth;
  const attackPower =
    linearInterpolate(level, maxLevel, atk, finalMaxAtk) +
    (trust ? trustAtk : 0) +
    potAttack;
  const defense =
    linearInterpolate(level, maxLevel, def, finalMaxDef) +
    (trust ? trustDef : 0) +
    potDefense;
  const artsResistance =
    linearInterpolate(level, maxLevel, res, finalMaxRes) +
    (trust ? trustRes : 0) +
    potRes;
  const redeployTimeInSeconds = redeploy + potRedeploy;
  const dpCost = dp + potDp;

  // ASPD...
  const secondsPerAttack = calculateSecondsPerAttack(
    baseAttackTime,
    100 + potASPD
  );

  return {
    health,
    attackPower,
    defense,
    artsResistance,
    dpCost,
    blockCount,
    redeployTimeInSeconds,
    secondsPerAttack,
    rangeObject,
  };
};

const linearInterpolate = (
  level: number,
  maxLevel: number,
  baseValue: number,
  maxValue: number
): number => {
  return Math.round(
    baseValue + ((level - 1) * (maxValue - baseValue)) / (maxLevel - 1)
  );
};

export const calculateSecondsPerAttack = (
  baseAttackTime: number,
  aspd: number
): number => {
  return Math.round((baseAttackTime * 30) / (aspd / 100.0)) / 30;
};

// Returns an array of CharacterStatValues changes at each potential level,
// with Pot2 at index 0 and Pot6 at index 4.
export const getPotStatIncreases = (
  characterObject: OutputTypes.Character
): PotentialStatChange[] => {
  const { potentialRanks } = characterObject;

  const statChanges: PotentialStatChange[] = [];

  potentialRanks.forEach((pot) => {
    if (pot.buff == null) {
      let desc = pot.description;
      if (desc.startsWith("Improves ")) {
        desc = desc.replace("Improves ", "") + " Enhancement";
      } else if (desc === "天赋效果增强") {
        desc = "Talent Enhancement";
      } else if (desc === "第一天赋效果增强") {
        desc = "First Talent Enhancement";
      } else if (desc === "第二天赋效果增强") {
        desc = "Second Talent Enhancement";
      }
      statChanges.push({
        health: 0,
        attackPower: 0,
        defense: 0,
        artsResistance: 0,
        dpCost: 0,
        attackSpeed: 0,
        redeployTimeInSeconds: 0,
        description: desc,
      });
      return;
    }
    const curStats: PotentialStatChange = {
      health: 0,
      attackPower: 0,
      defense: 0,
      artsResistance: 0,
      dpCost: 0,
      attackSpeed: 0,
      redeployTimeInSeconds: 0,
      description: null,
    };
    const attribType = pot.buff.attributes.attributeModifiers[0].attributeType;
    const attribChange = pot.buff.attributes.attributeModifiers[0].value;

    switch (attribType) {
      case 0:
        curStats.health += attribChange;
        break;
      case 1:
        curStats.attackPower += attribChange;
        break;
      case 2:
        curStats.defense += attribChange;
        break;
      case 3:
        curStats.artsResistance += attribChange;
        break;
      case 4:
        curStats.dpCost += attribChange;
        break;
      case 7:
        curStats.attackSpeed += attribChange;
        break;
      case 21:
        curStats.redeployTimeInSeconds += attribChange;
        break;
      default:
        console.warn("Unrecognized attribute in potentials");
        break;
    }
    statChanges.push(curStats);
  });

  return statChanges;
};

export const getMaxPotStatIncrease = (
  characterObject: OutputTypes.Character
): PotentialStatChange => {
  return getPotStatIncreases(characterObject).reduce(
    (vals: PotentialStatChange, previous: PotentialStatChange) => {
      return {
        health: vals.health + previous.health,
        attackPower: vals.attackPower + previous.attackPower,
        defense: vals.defense + previous.defense,
        artsResistance: vals.artsResistance + previous.artsResistance,
        dpCost: vals.dpCost + previous.dpCost,
        attackSpeed: vals.attackSpeed + previous.attackSpeed,
        redeployTimeInSeconds:
          vals.redeployTimeInSeconds + previous.redeployTimeInSeconds,
        description: null,
      };
    },
    {
      health: 0,
      attackPower: 0,
      defense: 0,
      artsResistance: 0,
      dpCost: 0,
      attackSpeed: 0,
      redeployTimeInSeconds: 0,
      description: null,
    }
  );
};

export const getMaxTrustStatIncrease = (
  characterObject: OutputTypes.Character
): {
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
} => {
  if (characterObject.favorKeyFrames == null) {
    throw new Error(
      `Can't get max trust stat increase, favorKeyFrames is null; charId: ${characterObject.charId}`
    );
  }
  return characterObject.favorKeyFrames[
    characterObject.favorKeyFrames.length - 1
  ].data;
};
