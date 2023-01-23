import React, { useState } from "react";
import cx from "clsx";

import {
  ArtsResistanceIcon,
  AttackPowerIcon,
  AttackSpeedIcon,
  BlockIcon,
  DPCostIcon,
  DefenseIcon,
  EliteZeroIcon,
  EliteOneIcon,
  EliteTwoIcon,
  HealthIcon,
  RedeployTimeIcon,
  PotentialTwoIcon,
  PotentialThreeIcon,
  PotentialFourIcon,
  PotentialFiveIcon,
  PotentialSixIcon,
} from "../icons/operatorStats";
import CharacterRange from "../CharacterRange";
import {
  doStatsChange,
  getMaxTrustStatIncrease,
  getPotStatIncreases,
  getStatsAtLevel,
} from "../../utils/character-stats";
import { summonImage } from "../../utils/images";
import CustomCheckbox from "../CustomCheckbox";
import RibbonButton from "../RibbonButton";
import RibbonButtonGroup from "../RibbonButtonGroup";
import SliderWithInput from "../SliderWithInput";
import TraitInfo from "../TraitInfo";
import Tooltip from "../Tooltip";
import useMediaQuery from "../../utils/media-query";
import { breakpoints } from "../../theme-helpers";

import type * as OutputTypes from "../../output-types";

import * as classes from "./styles.css";

const SUMMON_ICON_SIZE = 60;

export interface CharacterStatsProps {
  characterObject: OutputTypes.Character;
}

const CharacterStats: React.VFC<CharacterStatsProps> = ({
  characterObject,
}) => {
  const { charId: id, name, profession } = characterObject;
  const isSummon = profession === "TOKEN";
  const isMobile = useMediaQuery(breakpoints.down("mobile"));

  const phases = characterObject.phases;
  const maxElite = phases.length - 1;
  const maxLevel = phases[phases.length - 1].maxLevel;

  const trustIncreases = !isSummon
    ? getMaxTrustStatIncrease(characterObject)
    : {
        maxHp: 0,
        atk: 0,
        def: 0,
        magicResistance: 0,
      };

  const [eliteLevel, setEliteLevelFunc] = useState(maxElite);
  const [opLevel, setOpLevel] = useState(maxLevel);
  const [trustBonus, setTrustBonus] = useState(!isSummon);
  const [potentialBonus, setPotentialBonus] = useState(false);

  const setEliteLevel = (level: number) => {
    setEliteLevelFunc(level);
    if (opLevel > phases[level].maxLevel) {
      setOpLevel(phases[level].maxLevel);
    }
  };

  const {
    artsResistance,
    attackPower,
    secondsPerAttack,
    blockCount,
    defense,
    dpCost,
    health,
    rangeObject,
    redeployTimeInSeconds,
  } = getStatsAtLevel(characterObject, {
    eliteLevel: eliteLevel,
    level: opLevel,
    trust: trustBonus,
    pots: potentialBonus,
  });

  // detect if the summon stats don't change with leveling
  const doSummonStatsChange = isSummon && doStatsChange(characterObject);

  return (
    <section>
      {!isSummon && (
        <TraitInfo
          subProfessionId={characterObject.subProfessionId}
          showSubclassIcon={true}
        />
      )}

      <h3 className="visually-hidden">
        {`${isSummon ? "Summon" : "Operator"} Stats`}
      </h3>
      {(!isSummon || doSummonStatsChange) && (
        <div className={classes.statsControls}>
          <div className={classes.trustAndEliteButtons}>
            <RibbonButtonGroup>
              <RibbonButton
                active={eliteLevel === 0}
                onClick={() => {
                  setEliteLevel(0);
                }}
                aria-label="Elite 0"
              >
                <EliteZeroIcon active={eliteLevel === 0} />
              </RibbonButton>
              {maxElite >= 1 && (
                <RibbonButton
                  active={eliteLevel === 1}
                  onClick={() => {
                    setEliteLevel(1);
                  }}
                  aria-label="Elite 1"
                >
                  <EliteOneIcon active={eliteLevel === 1} />
                </RibbonButton>
              )}
              {maxElite >= 2 && (
                <RibbonButton
                  active={eliteLevel === 2}
                  onClick={() => {
                    setEliteLevel(2);
                  }}
                  aria-label="Elite 2"
                >
                  <EliteTwoIcon active={eliteLevel === 2} />
                </RibbonButton>
              )}
            </RibbonButtonGroup>
            <div className={classes.mobileSpacer} />
            {!isSummon && (
              <div className={classes.checkboxContainer}>
                <Tooltip
                  interactive
                  trigger="mouseenter focusin"
                  content={
                    <ul className={classes.statsChangeList}>
                      {trustIncreases.maxHp > 0 && (
                        <li className={classes.statsChangeListItem}>
                          HP&nbsp;
                          <span className={classes.statChangeValue}>
                            +{trustIncreases.maxHp}
                          </span>
                        </li>
                      )}
                      {trustIncreases.atk > 0 && (
                        <li className={classes.statsChangeListItem}>
                          ATK&nbsp;
                          <span className={classes.statChangeValue}>
                            +{trustIncreases.atk}
                          </span>
                        </li>
                      )}
                      {trustIncreases.def > 0 && (
                        <li className={classes.statsChangeListItem}>
                          DEF&nbsp;
                          <span className={classes.statChangeValue}>
                            +{trustIncreases.def}
                          </span>
                        </li>
                      )}
                      {trustIncreases.magicResistance > 0 && (
                        <li className={classes.statsChangeListItem}>
                          RES&nbsp;
                          <span className={classes.statChangeValue}>
                            +{trustIncreases.magicResistance}
                          </span>
                        </li>
                      )}
                    </ul>
                  }
                >
                  <CustomCheckbox
                    label="Trust"
                    checked={trustBonus}
                    onChange={(e) => {
                      setTrustBonus(e.target.checked);
                    }}
                  />
                </Tooltip>
                <Tooltip
                  interactive
                  trigger="mouseenter focusin"
                  content={
                    <ul className={classes.statsChangeList}>
                      {getPotStatIncreases(characterObject).map((pot, i) => {
                        return (
                          <li
                            key={`potential-${i}-stat-change`}
                            className={classes.statsChangeListItem}
                          >
                            {i === 0 && (
                              <PotentialTwoIcon
                                className={classes.statsChangeListItemIcon}
                              />
                            )}
                            {i === 1 && (
                              <PotentialThreeIcon
                                className={classes.statsChangeListItemIcon}
                              />
                            )}
                            {i === 2 && (
                              <PotentialFourIcon
                                className={classes.statsChangeListItemIcon}
                              />
                            )}
                            {i === 3 && (
                              <PotentialFiveIcon
                                className={classes.statsChangeListItemIcon}
                              />
                            )}
                            {i === 4 && (
                              <PotentialSixIcon
                                className={classes.statsChangeListItemIcon}
                              />
                            )}
                            {pot.health > 0 && (
                              <span>
                                HP&nbsp;
                                <span className={classes.statChangeValue}>
                                  +{pot.health}
                                </span>
                              </span>
                            )}
                            {pot.attackPower > 0 && (
                              <span>
                                ATK&nbsp;
                                <span className={classes.statChangeValue}>
                                  +{pot.attackPower}
                                </span>
                              </span>
                            )}
                            {pot.defense > 0 && (
                              <span>
                                DEF&nbsp;
                                <span className={classes.statChangeValue}>
                                  +{pot.defense}
                                </span>
                              </span>
                            )}
                            {pot.artsResistance > 0 && (
                              <span>
                                RES&nbsp;
                                <span className={classes.statChangeValue}>
                                  +{pot.artsResistance}%
                                </span>
                              </span>
                            )}
                            {pot.dpCost < 0 && (
                              <span>
                                DP Cost&nbsp;
                                <span className={classes.statChangeValue}>
                                  {pot.dpCost}
                                </span>
                              </span>
                            )}
                            {pot.attackSpeed > 0 && (
                              <span>
                                ASPD&nbsp;
                                <span className={classes.statChangeValue}>
                                  +{pot.attackSpeed}
                                </span>
                              </span>
                            )}
                            {pot.redeployTimeInSeconds < 0 && (
                              <span>
                                Redeploy Time&nbsp;
                                <span className={classes.statChangeValue}>
                                  {pot.redeployTimeInSeconds}
                                </span>
                              </span>
                            )}
                            {pot.description && (
                              <span className={classes.potentialDescription}>
                                {pot.description}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  }
                >
                  <CustomCheckbox
                    label={isMobile ? "Pot." : "Potential"}
                    checked={potentialBonus}
                    onChange={(e) => {
                      setPotentialBonus(e.target.checked);
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
          <div className={classes.spacer} />
          <SliderWithInput
            label="Level"
            id={isSummon ? "summon-level" : "operator-level"}
            value={opLevel}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === "") {
                setOpLevel(1);
              } else if (Number(e.target.value) > phases[eliteLevel].maxLevel) {
                setOpLevel(
                  Math.min(
                    Number(`${e.target.value}`.slice(0, 2)),
                    phases[eliteLevel].maxLevel
                  )
                );
              } else {
                setOpLevel(
                  Math.min(Number(e.target.value), phases[eliteLevel].maxLevel)
                );
              }
            }}
            onKeyPress={(e) => {
              if (!/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={2}
            onFocus={(e) => e.target.select()}
            type="number"
            min={1}
            max={phases[eliteLevel].maxLevel}
            sliderProps={{
              value: opLevel,
              // @ts-expect-error MUI typing tells me to do this
              onChange: (e: Event) => setOpLevel(Number(e.target.value)),
              min: 1,
              max: phases[eliteLevel].maxLevel,
            }}
          />
        </div>
      )}
      <dl
        className={cx(
          isSummon ? classes.statsList.summon : classes.statsList.operator,
          isSummon && !doSummonStatsChange && classes.statsListNoStatChanges
        )}
      >
        {isSummon && (
          <div className={classes.summonIcon}>
            <img
              src={summonImage(id)}
              alt={name}
              width={SUMMON_ICON_SIZE}
              height={SUMMON_ICON_SIZE}
            />
          </div>
        )}

        <div>
          <dt>
            <HealthIcon
              aria-hidden="true"
              pathClassName={classes.healthIconPath}
            />{" "}
            {isMobile ? "HP" : "Health"}
          </dt>
          <dd>{health}</dd>
        </div>

        <div className={classes.attackPower}>
          <dt>
            <AttackPowerIcon
              aria-hidden="true"
              pathClassName={classes.attackPowerIconPath}
            />{" "}
            {isMobile ? "ATK" : "Attack Power"}
          </dt>
          <dd>{attackPower}</dd>
        </div>

        <div>
          <dt>
            <DefenseIcon
              aria-hidden="true"
              pathClassName={classes.defenseIconPath}
            />{" "}
            {isMobile ? "DEF" : "Defense"}
          </dt>
          <dd>{defense}</dd>
        </div>

        <div>
          <dt>
            <AttackSpeedIcon
              aria-hidden="true"
              pathClassName={classes.attackSpeedIconPath}
            />{" "}
            {isMobile ? "ASPD" : "Attack Speed"}
          </dt>
          <dd>{Math.round(secondsPerAttack * 100) / 100} sec</dd>
        </div>

        <div>
          <dt>
            <ArtsResistanceIcon
              aria-hidden="true"
              pathClassName={classes.artsResistanceIconPath}
            />{" "}
            {isMobile ? "RES" : "Arts Resistance"}
          </dt>
          <dd>{artsResistance}%</dd>
        </div>

        <div>
          <dt>
            <BlockIcon
              aria-hidden="true"
              pathClassName={classes.blockIconPath}
            />{" "}
            Block
          </dt>
          <dd>{blockCount}</dd>
        </div>

        <div>
          <dt>
            <RedeployTimeIcon
              aria-hidden="true"
              pathClassName={classes.redeployTimeIconPath}
            />{" "}
            {isMobile ? "Redeploy" : "Redeploy Time"}
          </dt>
          <dd>{redeployTimeInSeconds} sec</dd>
        </div>

        <div>
          <dt>
            <DPCostIcon
              aria-hidden="true"
              pathClassName={classes.dpCostIconPath}
            />{" "}
            DP Cost
          </dt>
          <dd>{dpCost}</dd>
        </div>

        <div className={classes.range}>
          <dt className={isMobile ? "visually-hidden" : ""}>Range</dt>
          <dd className={classes.rangeDetails}>
            <CharacterRange rangeObject={rangeObject} />
          </dd>
        </div>
      </dl>
    </section>
  );
};
export default CharacterStats;
