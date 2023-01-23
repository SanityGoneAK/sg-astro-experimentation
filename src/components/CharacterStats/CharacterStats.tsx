import { useMemo } from "react";

import {
  ArtsResistanceIcon,
  AttackPowerIcon,
  AttackSpeedIcon,
  BlockIcon,
  DefenseIcon,
  DPCostIcon,
  HealthIcon,
  HourglassIcon,
} from "../icons";
import { getStatsAtLevel } from "../../utils/character-stats";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  character: OutputTypes.Character;
  elite: number;
  level: number;
  useTrustBonus: boolean;
  usePotentialBonus: boolean;
  moduleId: string | null;
  moduleLevel: number;
}

const CharacterStats: React.FC<Props> = ({
  elite,
  level,
  useTrustBonus,
  usePotentialBonus,
  moduleId, // TODO modules aren't taken into account yet
  moduleLevel, // TODO
  character,
}) => {
  const {
    health,
    defense,
    artsResistance,
    redeployTimeInSeconds,
    attackPower,
    secondsPerAttack,
    blockCount,
    dpCost,
    rangeObject: range,
  } = useMemo(
    () =>
      getStatsAtLevel(character, {
        eliteLevel: elite,
        level,
        pots: usePotentialBonus,
        trust: useTrustBonus,
      }),
    [elite, level, usePotentialBonus, useTrustBonus, character]
  );

  return (
    <dl className={classes.root}>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <HealthIcon pathClassName={classes.iconPath} />
          <span>Health</span>
        </dt>
        <dd className={classes.dd}>{health}</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <DefenseIcon pathClassName={classes.iconPath} />
          <span>Defense</span>
        </dt>
        <dd className={classes.dd}>{defense}</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <ArtsResistanceIcon pathClassName={classes.iconPath} />
          <span>Arts Resistance</span>
        </dt>
        <dd className={classes.dd}>{artsResistance}</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <HourglassIcon pathClassName={classes.iconPath} />
          <span>Redeploy Time</span>
        </dt>
        <dd className={classes.dd}>{redeployTimeInSeconds} sec</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <AttackPowerIcon pathClassName={classes.iconPath} />
          <span>Attack Power</span>
        </dt>
        <dd className={classes.dd}>{attackPower}</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <AttackSpeedIcon pathClassName={classes.iconPath} />
          <span>Attack Interval</span>
        </dt>
        <dd className={classes.dd}>{secondsPerAttack.toFixed(2)} sec</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <BlockIcon pathClassName={classes.iconPath} />
          <span>Block</span>
        </dt>
        <dd className={classes.dd}>{blockCount}</dd>
      </div>
      <div className={classes.statItem}>
        <dt className={classes.dt}>
          <DPCostIcon pathClassName={classes.iconPath} />
          <span>DP Cost</span>
        </dt>
        <dd className={classes.dd}>{dpCost}</dd>
      </div>
    </dl>
  );
};
export default CharacterStats;
