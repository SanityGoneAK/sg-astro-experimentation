import { useState } from "react";

import EliteButtonGroup from "../EliteButtonGroup";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  character: OutputTypes.Character;
}

const OperatorAttributesPanel: React.FC<Props> = ({ character }) => {
  const maxElite = character.phases.length - 1;
  const [elite, setElite] = useState(maxElite);

  return (
    <>
      <div className={classes.knobsContainer}>
        <EliteButtonGroup
          currentElite={elite}
          maxElite={maxElite}
          onChange={setElite}
        />
      </div>
    </>
  );
};

export default OperatorAttributesPanel;
