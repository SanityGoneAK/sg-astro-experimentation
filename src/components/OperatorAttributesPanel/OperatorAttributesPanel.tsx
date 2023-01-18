import { useMemo, useState } from "react";
import { useStore } from "@nanostores/react";

import EliteButtonGroup from "../EliteButtonGroup";
import SliderWithInput from "../SliderWithInput";
import PillButtonGroup from "../PillButtonGroup";
import modulesJson from "../../../data/modules.json";
import CustomCheckbox from "../CustomCheckbox";
import { operatorStore } from "../../pages/operators/_store";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

const OperatorAttributesPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  const maxElite = operator.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const [level, setLevel] = useState(operator.phases.at(-1)!.maxLevel);
  const moduleTypes = useMemo(() => {
    const modules = (modulesJson[operator.charId as keyof typeof modulesJson] ??
      []) as OutputTypes.Module[];
    return [
      "None",
      ...modules
        .map((module) => module.moduleIcon.at(-1)!.toUpperCase())
        .sort((a, b) => a.localeCompare(b)),
    ];
  }, []);
  const [moduleType, setModuleType] = useState(moduleTypes.at(-1)!);
  const [moduleLevel, setModuleLevel] = useState<1 | 2 | 3>(3);
  const [isTrustBonusChecked, setTrustBonusChecked] = useState(false);
  const [isPotentialBonusChecked, setPotentialBonusChecked] = useState(false);

  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setLevel(Math.min(operator.phases[newElite].maxLevel, level));
  };

  return (
    <>
      <div className={classes.knobsContainer}>
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
    </>
  );
};

export default OperatorAttributesPanel;
