import { useState } from "react";
import { useStore } from "@nanostores/react";

import EliteButtonGroup from "../EliteButtonGroup";
import OperatorTalent from "../OperatorTalent/OperatorTalent";
import PotentialsDropdown from "../PotentialsDropdown";
import { operatorStore } from "../../pages/operators/_store";

import * as classes from "./styles.css";

const OperatorTalentsPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  const maxElite = operator.phases.length - 1;
  const [elite, setElite] = useState(maxElite);
  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setPotential(potentialsMap[maxElite][0]);
  };

  const potentialsMap: { [eliteLevel: number]: number[] } = {};
  operator.talents.forEach((talent) => {
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

  console.log(operator.talents);
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
        {operator.talents.map((talent, index) => (
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
