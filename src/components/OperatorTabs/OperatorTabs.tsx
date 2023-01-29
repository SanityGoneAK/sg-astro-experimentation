import { Tab } from "@headlessui/react";

import * as classes from "./styles.css";
import OperatorAttributesPanel from "../OperatorAttributesPanel";
import OperatorRiicPanel from "../OperatorRiicPanel";
import OperatorSkillsPanel from "../OperatorSkillsPanel";
import OperatorTalentsPanel from "../OperatorTalentsPanel";

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
        <Tab.Panel>
          {/* TODO */}
          Modules panel
        </Tab.Panel>
        <Tab.Panel>
          <OperatorRiicPanel />
        </Tab.Panel>
        <Tab.Panel>
          {/* TODO */}
          Misc panel
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};
export default OperatorTabs;
