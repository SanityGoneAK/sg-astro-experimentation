import { useState } from "react";

import EliteButtonGroup from "../EliteButtonGroup";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";
import SliderWithInput from "../SliderWithInput";
import PillButtonGroup from "../PillButtonGroup";

interface Props {
  character: OutputTypes.Character;
}

const OperatorAttributesPanel: React.FC<Props> = ({ character }) => {
  const maxElite = character.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const [level, setLevel] = useState(character.phases.at(-1)!.maxLevel);
  const [moduleLevel, setModuleLevel] = useState("None");

  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setLevel(Math.min(character.phases[newElite].maxLevel, level));
  };

  return (
    <>
      <div className={classes.knobsContainer}>
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
        <PillButtonGroup
          labels={["None", "X", "Y"]}
          value={moduleLevel}
          onChange={setModuleLevel}
        />
      </div>
    </>
  );
};

export default OperatorAttributesPanel;
