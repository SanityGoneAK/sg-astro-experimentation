import { useMemo, useState } from "react";

import { useStore } from "@nanostores/react";
import cx from "clsx";

import PillButtonGroup from "../PillButtonGroup";
import SliderWithInput from "../SliderWithInput";
import CharacterRange from "../CharacterRange";
import MaterialRequirements from "../MaterialRequirements";
import { descriptionToHtml } from "../../description-parser";
import { operatorStore } from "../../pages/operators/_store";
import { skillIcon } from "../../utils/images";
import { SpCostIcon, InitialSpIcon, HourglassIcon } from "../icons";

import * as classes from "./styles.css";
import * as sharedPanelClasses from "../OperatorTabs/sharedPanelStyles.css";
import * as OutputTypes from "../../output-types";

const OperatorSkillsPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  const numSkills = operator.skillData.length;
  const [skillNumber, setSkillNumber] = useState(numSkills);
  const maxSkillLevel = operator.phases.length > 2 ? 10 : 7;
  const [skillLevel, setSkillLevel] = useState(maxSkillLevel);
  const skillLabels = useMemo(
    () => [...Array(numSkills).keys()].map((_, i) => i + 1),
    []
  );
  const activeSkillTableSkill = operator.skillData[skillNumber - 1];
  const activeSkillLevel = activeSkillTableSkill.levels[skillLevel - 1];
  const { itemCosts, minElite, minLevel } = useMemo(() => {
    if (skillLevel === 1) {
      return {
        itemCosts: null,
        minElite: 0,
        minLevel: 1,
      };
    }
    if (skillLevel <= 7) {
      const upgrade = operator.allSkillLvlup[skillLevel - 1 - 1];
      return {
        itemCosts: upgrade.lvlUpCost,
        minElite: upgrade.unlockCond.phase,
        minLevel: upgrade.unlockCond.level,
      };
    }
    // skillLevel > 7 means we're in masteries
    const upgrade =
      operator.skills[skillNumber - 1].levelUpCostCond[skillLevel - 7 - 1];
    return {
      itemCosts: upgrade.levelUpCost,
      minElite: upgrade.unlockCond.phase,
      minLevel: upgrade.unlockCond.level,
    };
  }, [skillNumber, skillLevel]);

  const skillDisplayDuration = useMemo(() => {
    if (activeSkillLevel.duration === -1) {
      return "Infinite";
    }
    if (activeSkillLevel.duration === 0) {
      return "Instant";
    }
    return `${activeSkillLevel.duration} sec`;
  }, [activeSkillLevel.duration]);

  return (
    <>
      <div className={cx(sharedPanelClasses.knobsContainer, classes.knobs)}>
        <div className={classes.skillSelect}>
          <span>Skill</span>
          <PillButtonGroup
            labels={skillLabels}
            value={skillNumber}
            onChange={setSkillNumber}
          />
        </div>
        <SliderWithInput
          type="skill"
          value={skillLevel}
          onChange={setSkillLevel}
          max={maxSkillLevel}
        />
      </div>
      <div className={classes.skillData}>
        <div className={classes.skillIconNameAndType}>
          <img
            className={classes.skillIcon}
            src={skillIcon(
              activeSkillTableSkill.iconId,
              activeSkillTableSkill.skillId
            )}
            alt=""
          />
          <h2 className={classes.skillName}>{activeSkillLevel.name}</h2>
          <dl className={classes.skillType}>
            <div className={classes.skillTypeItem}>
              <dt>Activation</dt>
              <dd>{OutputTypes.SkillType[activeSkillLevel.skillType]}</dd>
            </div>
            <div className={classes.skillTypeItem}>
              <dt>Recovery</dt>
              <dd>{OutputTypes.SkillSpType[activeSkillLevel.spData.spType]}</dd>
            </div>
          </dl>
        </div>
        <dl className={classes.skillSpType}>
          <div className={classes.skillSpTypeItem}>
            <SpCostIcon />
            <dt>SP Cost</dt>
            <dd>{activeSkillLevel.spData.spCost}</dd>
          </div>
          <div className={classes.skillSpTypeItem}>
            <InitialSpIcon />
            <dt>Initial SP</dt>
            <dd>{activeSkillLevel.spData.initSp}</dd>
          </div>
          <div className={classes.skillSpTypeItem}>
            <HourglassIcon />
            <dt>Duration</dt>
            <dd>{skillDisplayDuration}</dd>
          </div>
        </dl>
        {activeSkillLevel.description && (
          <p
            className={classes.skillDescription}
            dangerouslySetInnerHTML={{
              __html: descriptionToHtml(
                activeSkillLevel.description,
                activeSkillLevel.blackboard
              ),
            }}
          />
        )}
        {activeSkillLevel.range && (
          <CharacterRange
            className={classes.skillRange}
            rangeObject={activeSkillLevel.range}
          />
        )}
        {itemCosts && (
          <MaterialRequirements
            itemCosts={itemCosts}
            minElite={minElite}
            minLevel={minLevel}
            minSkillLevel={skillLevel - 1}
          />
        )}
      </div>
    </>
  );
};
export default OperatorSkillsPanel;
