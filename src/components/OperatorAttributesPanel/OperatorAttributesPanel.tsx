import { useState } from "react";

import EliteSelect from "../EliteSelect/EliteSelect";

import type * as OutputTypes from "../../output-types";

interface Props {
  character: OutputTypes.Character;
}

const OperatorAttributesPanel: React.FC<Props> = ({ character }) => {
  const maxElite = character.phases.length - 1;
  const [elite, setElite] = useState(maxElite);

  return (
    <>
      <EliteSelect
        currentElite={elite}
        maxElite={maxElite}
        onChange={setElite}
      />
    </>
  );
};

export default OperatorAttributesPanel;
