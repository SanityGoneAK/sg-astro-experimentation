import { useMemo, useState } from "react";
import { useStore } from "@nanostores/react";

import EliteButtonGroup from "../EliteButtonGroup";
import SliderWithInput from "../SliderWithInput";
import PillButtonGroup from "../PillButtonGroup";
import CustomCheckbox from "../CustomCheckbox";
import CharacterStats from "../CharacterStats";
import { operatorStore } from "../../pages/operators/_store";

import * as classes from "./styles.css";
import * as sharedPanelClasses from "../OperatorTabs/sharedPanelStyles.css";

const OperatorAttributesPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  const maxElite = operator.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const [level, setLevel] = useState(operator.phases.at(-1)!.maxLevel);
  const moduleTypes = useMemo(() => {
    return [
      "None",
      ...operator.modules
        .map((module) => module.moduleIcon.at(-1)!.toUpperCase())
        .sort((a, b) => a.localeCompare(b)),
    ];
  }, [operator.modules]);
  const [moduleType, setModuleType] = useState(moduleTypes.at(-1)!);
  const [moduleLevel, setModuleLevel] = useState<1 | 2 | 3>(3);
  const [isTrustBonusChecked, setTrustBonusChecked] = useState(false);
  const [isPotentialBonusChecked, setPotentialBonusChecked] = useState(false);

  const moduleId =
    moduleType === "None"
      ? null
      : operator.modules.find((module) =>
          module.moduleIcon.endsWith(moduleType)
        )!.moduleId;

  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setLevel(Math.min(operator.phases[newElite].maxLevel, level));
  };

  return (
    <>
      <div className={sharedPanelClasses.knobsContainer}>
        <div className={classes.eliteAndLevel}>
          <EliteButtonGroup
            currentElite={elite}
            maxElite={maxElite}
            onChange={handleEliteChange}
          />
          <SliderWithInput
            type="level"
            max={operator.phases[elite].maxLevel}
            value={level}
            onChange={setLevel}
          />
        </div>
        <div className={classes.trustPotentialModule}>
          <div>
            <CustomCheckbox
              className={classes.label}
              label="Trust Bonus"
              checked={isTrustBonusChecked}
              onChange={setTrustBonusChecked}
            />
          </div>
          <div>
            <CustomCheckbox
              className={classes.label}
              label="Potential Bonus"
              checked={isPotentialBonusChecked}
              onChange={setPotentialBonusChecked}
            />
          </div>
          {moduleTypes.length > 1 && (
            <div className={classes.moduleKnobs}>
              <span className={classes.label}>Module</span>
              <PillButtonGroup
                labels={moduleTypes}
                value={moduleType}
                onChange={setModuleType}
              />
              <PillButtonGroup
                labels={[1, 2, 3]}
                value={moduleLevel}
                onChange={setModuleLevel}
                disabled={moduleType === "None"}
              />
            </div>
          )}
        </div>
      </div>
      <div className={classes.statsMaterialsContainer}>
        <CharacterStats
          character={operator}
          elite={elite}
          level={level}
          moduleId={moduleId}
          moduleLevel={moduleLevel}
          usePotentialBonus={isPotentialBonusChecked}
          useTrustBonus={isTrustBonusChecked}
        />
      </div>
    </>
  );
};

export default OperatorAttributesPanel;
