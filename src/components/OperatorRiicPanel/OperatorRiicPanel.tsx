import { useStore } from "@nanostores/react";
import { descriptionToHtml } from "../../description-parser";

import { operatorStore } from "../../pages/operators/_store";
import { riicSkillIcon } from "../../utils/images";

import * as classes from "./styles.css";

const OperatorRiicPanel: React.FC = () => {
  const operator = useStore(operatorStore);
  return (
    <>
      {operator.riicSkills.map(({ stages }, i) => (
        <div key={i}>
          {stages.map(
            ({ buffId, description, minElite, minLevel, name, skillIcon }) => (
              <div key={buffId}>
                <img alt="" src={riicSkillIcon(skillIcon)} />
                <h2>{name}</h2>
                {/* <div
                  dangerouslySetInnerHTML={{
                    __html: descriptionToHtml(description, []),
                  }}
                /> */}
                Elite: {minElite}
                Level: {minLevel}
                <p>{description}</p>
              </div>
            )
          )}
          <hr />
        </div>
      ))}
    </>
  );
};
export default OperatorRiicPanel;
