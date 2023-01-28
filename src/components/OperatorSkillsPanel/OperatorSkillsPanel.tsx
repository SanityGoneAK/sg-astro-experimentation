import { useMemo, useState } from "react";

import { useStore } from "@nanostores/react";

import PillButtonGroup from "../PillButtonGroup";
import SliderWithInput from "../SliderWithInput";
import CharacterRange from "../CharacterRange";
import { descriptionToHtml } from "../../description-parser";
import { operatorStore } from "../../pages/operators/_store";
import { skillIcon } from "../../utils/images";

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

  return (
    <div className={classes.root}>
      <div className={sharedPanelClasses.knobsContainer}>
        <span className={classes.skillLabel}>Skill</span>
        <PillButtonGroup
          labels={skillLabels}
          value={skillNumber}
          onChange={setSkillNumber}
        />
        <SliderWithInput
          type="skill"
          value={skillLevel}
          onChange={setSkillLevel}
          max={maxSkillLevel}
        />
      </div>
      <div className={classes.skillData}>
        <img
          src={skillIcon(
            activeSkillTableSkill.iconId,
            activeSkillTableSkill.skillId
          )}
          alt=""
        />
        <h2>{activeSkillLevel.name}</h2>
        <dl>
          <div>
            <dt>Activation</dt>
            <dd>{OutputTypes.SkillType[activeSkillLevel.skillType]}</dd>
          </div>
          <div>
            <dt>Recovery</dt>
            <dd>{OutputTypes.SkillSpType[activeSkillLevel.spData.spType]}</dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>SP Cost</dt>
            <dd>{activeSkillLevel.spData.spCost}</dd>
          </div>
          <div>
            <dt>Initial SP</dt>
            <dd>{activeSkillLevel.spData.initSp}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{activeSkillLevel.duration}</dd>
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
          <CharacterRange rangeObject={activeSkillLevel.range} />
        )}
      </div>
    </div>
  );
};
export default OperatorSkillsPanel;
