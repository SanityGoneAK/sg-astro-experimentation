import { useMemo, useState } from "react";

import EliteButtonGroup from "../EliteButtonGroup";
import SliderWithInput from "../SliderWithInput";
import PillButtonGroup from "../PillButtonGroup";
import modulesJson from "../../../data/modules.json";
import CustomCheckbox from "../CustomCheckbox";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";
import OperatorTalent from "../OperatorTalent/OperatorTalent";
import PotentialsDropdown from "../PotentialsDropdown";

interface Props {
  character: OutputTypes.Character;
}

const OperatorTalentsPanel: React.FC<Props> = ({ character }) => {
  const maxElite = character.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setPotential(potentialsMap[maxElite][0]);
  };

  const potentialsMap: { [eliteLevel: number]: number[] } = {};
  character.talents.forEach((talent) => {
    talent.candidates.forEach((talentPhase) => {
      const { phase: eliteLevel } = talentPhase.unlockCondition;
      const { requiredPotentialRank: potential } = talentPhase;

      potentialsMap[eliteLevel] = [
        potential,
        ...new Set(potentialsMap[eliteLevel] ?? []),
      ].sort();
    });
  });
  const [potential, setPotential] = useState(potentialsMap[maxElite][0]);

  console.log(character.talents);
  return (
    <>
      <div className={classes.knobsContainer}>
        <EliteButtonGroup
          currentElite={elite}
          maxElite={maxElite}
          onChange={handleEliteChange}
        />
        <div className={classes.potentialDropwdown}>
          <PotentialsDropdown
            potentialsToShow={potentialsMap[elite]}
            currentPotential={potential}
            onChange={setPotential}
          ></PotentialsDropdown>
        </div>
      </div>

      <div>
        {character.talents.map((talent, index) => (
          <OperatorTalent
            key={index}
            talentNumber={index + 1}
            talent={talent}
            eliteLevel={elite}
            potential={potential}
          ></OperatorTalent>
        ))}
      </div>
    </>
  );
};

export default OperatorTalentsPanel;
