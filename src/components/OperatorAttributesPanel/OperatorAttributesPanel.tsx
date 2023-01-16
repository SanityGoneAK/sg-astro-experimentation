import { useMemo, useState } from "react";

import EliteButtonGroup from "../EliteButtonGroup";
import SliderWithInput from "../SliderWithInput";
import PillButtonGroup from "../PillButtonGroup";
import modulesJson from "../../../data/modules.json";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  character: OutputTypes.Character;
}

const OperatorAttributesPanel: React.FC<Props> = ({ character }) => {
  const maxElite = character.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const [level, setLevel] = useState(character.phases.at(-1)!.maxLevel);
  const moduleTypes = useMemo(() => {
    const modules = (modulesJson[
      character.charId as keyof typeof modulesJson
    ] ?? []) as OutputTypes.Module[];
    return [
      "None",
      ...modules
        .map((module) => module.moduleIcon.at(-1)!.toUpperCase())
        .sort((a, b) => a.localeCompare(b)),
    ];
  }, []);
  const [moduleType, setModuleType] = useState(moduleTypes.at(-1)!);
  const [moduleLevel, setModuleLevel] = useState<1 | 2 | 3>(3);

  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setLevel(Math.min(character.phases[newElite].maxLevel, level));
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
            max={character.phases[elite].maxLevel}
            value={level}
            onChange={setLevel}
          />
        </div>
        <div className={classes.trustPotentialModule}>
          <div>trust</div>
          <div>potential</div>
          <div className={classes.moduleKnobs}>
            <span className={classes.label}>Module</span>
            {moduleTypes.length > 1 && (
              <PillButtonGroup
                labels={moduleTypes}
                value={moduleType}
                onChange={setModuleType}
              />
            )}
            <PillButtonGroup
              labels={[1, 2, 3]}
              value={moduleLevel}
              onChange={setModuleLevel}
              disabled={moduleType === "None"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorAttributesPanel;
