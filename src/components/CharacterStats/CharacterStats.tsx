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
import * as classes from "./styles.css";

interface Props {
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
  moduleId,
  moduleLevel,
}) => {
  return (
    <dl className={classes.root}>
      <div>
        <dt className={classes.dt}>
          <HealthIcon pathClassName={classes.iconPath} />
          <span>Health</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <DefenseIcon pathClassName={classes.iconPath} />
          <span>Defense</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <ArtsResistanceIcon pathClassName={classes.iconPath} />
          <span>Arts Resistance</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <HourglassIcon pathClassName={classes.iconPath} />
          <span>Redeploy Time</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <AttackPowerIcon pathClassName={classes.iconPath} />
          <span>Attack Power</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <AttackSpeedIcon pathClassName={classes.iconPath} />
          <span>Attack Interval</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <BlockIcon pathClassName={classes.iconPath} />
          <span>Block</span>
        </dt>
        <dd></dd>
      </div>
      <div>
        <dt className={classes.dt}>
          <DPCostIcon pathClassName={classes.iconPath} />
          <span>DP Cost</span>
        </dt>
        <dd></dd>
      </div>
    </dl>
  );
};
export default CharacterStats;
