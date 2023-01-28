import { Tab } from "@headlessui/react";

import OperatorAttributesPanel from "../OperatorAttributesPanel";
import OperatorSkillsPanel from "../OperatorSkillsPanel";
import OperatorTalentsPanel from "../OperatorTalentsPanel";

import * as classes from "./styles.css";

const OperatorTabs: React.FC = () => {
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
          <OperatorAttributesPanel />
        </Tab.Panel>
        <Tab.Panel>
          <OperatorTalentsPanel />
        </Tab.Panel>
        <Tab.Panel>
          <OperatorSkillsPanel />
        </Tab.Panel>
        {["Modules", "RIIC", "Misc"].map((label) => {
          return <Tab.Panel key={label}>{label} panel</Tab.Panel>;
        })}
      </Tab.Panels>
    </Tab.Group>
  );
};
export default OperatorTabs;
