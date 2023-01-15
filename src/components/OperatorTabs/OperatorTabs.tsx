import { Tab } from "@headlessui/react";

import OperatorAttributesPanel from "../OperatorAttributesPanel";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  character: OutputTypes.Character;
}

const OperatorTabs: React.FC<Props> = ({ character }) => {
  return (
    <Tab.Group as="div">
      <Tab.List className={classes.tabList}>
        {["Attributes", "Talents", "Skills", "Modules", "RIIC", "Misc"].map(
          (label) => {
            return (
              <Tab key={label} className={classes.tabListButton}>
                {label}
              </Tab>
            );
          }
        )}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <OperatorAttributesPanel character={character} />
        </Tab.Panel>
        {["Talents", "Skills", "Modules", "RIIC", "Misc"].map((label) => {
          return <Tab.Panel key={label}>{label} panel</Tab.Panel>;
        })}
      </Tab.Panels>
    </Tab.Group>
  );
};
export default OperatorTabs;
