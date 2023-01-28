import { useMemo, useState } from "react";

import cx from "clsx";
import { useStore } from "@nanostores/react";

import EliteButtonGroup from "../EliteButtonGroup";
import OperatorTalent from "../OperatorTalent/OperatorTalent";
import PotentialsDropdown from "../PotentialsDropdown";
import { operatorStore } from "../../pages/operators/_store";

import * as classes from "./styles.css";
import * as sharedPanelClasses from "../OperatorTabs/sharedPanelStyles.css";

const OperatorTalentsPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  const maxElite = operator.phases.length - 1;
  const [elite, setElite] = useState(maxElite);

  // Compute the map of available potentials at each elite level.
  // Only needs to be done once, so an empty useMemo is used.
  const potentialsMap = useMemo(() => {
    const potentialsMap: { [eliteLevel: number]: number[] } = {};
    operator.talents.forEach((talent) => {
      talent.candidates.forEach((talentPhase) => {
        const { phase: eliteLevel } = talentPhase.unlockCondition;
        const { requiredPotentialRank: pot } = talentPhase;
        potentialsMap[eliteLevel] = [
          ...new Set([pot, ...(potentialsMap[eliteLevel] ?? [])]),
        ].sort();
      });
    });
    return potentialsMap;
  }, []);
  const [potential, setPotential] = useState(potentialsMap[maxElite][0]);

  const handleEliteChange = (newElite: number) => {
    setElite(newElite);
    setPotential(potentialsMap[maxElite][0]);
  };

  return (
    <>
      <div className={cx(sharedPanelClasses.knobsContainer, classes.knobs)}>
        <EliteButtonGroup
          currentElite={elite}
          maxElite={maxElite}
          onChange={handleEliteChange}
        />
        <PotentialsDropdown
          potentialsToShow={potentialsMap[elite]}
          currentPotential={potential}
          onChange={setPotential}
        />
      </div>

      <div>
        {operator.talents.map((talent, index) => (
          <OperatorTalent
            key={index}
            talentNumber={index + 1}
            talent={talent}
            eliteLevel={elite}
            potential={potential}
          />
        ))}
      </div>
    </>
  );
};

export default OperatorTalentsPanel;
