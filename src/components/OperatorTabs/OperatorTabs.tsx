import { Tab } from "@headlessui/react";
import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { operatorStore } from "../../pages/operators/_store";
import OperatorAttributesPanel from "../OperatorAttributesPanel";
import OperatorRiicPanel from "../OperatorRiicPanel";
import OperatorSkillsPanel from "../OperatorSkillsPanel";
import OperatorTalentsPanel from "../OperatorTalentsPanel";

const OperatorTabs: React.FC = () => {
  const operator = useStore(operatorStore);
  const tabs = [
    "Attributes",
    "Talents",
    operator.skillData.length > 0 && "Skills",
    "Modules",
    "RIIC",
    "Misc",
  ].filter(Boolean) as string[];

  return (
    <Tab.Group as="div">
      <Tab.List className={classes.tabList}>
        {tabs.map((label) => {
          return (
            <Tab
              key={label}
              id={`operator-${label.toLowerCase()}-button`}
              aria-controls={`operator-${label.toLowerCase()}-tabpanel`}
              className={classes.tabListButton}
            >
              {label}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel id="operator-attributes-panel">
          <OperatorAttributesPanel />
        </Tab.Panel>
        <Tab.Panel id="operator-talents-panel">
          <OperatorTalentsPanel />
        </Tab.Panel>
        {operator.skillData.length > 0 && (
          <Tab.Panel id="operator-skills-panel">
            <OperatorSkillsPanel />
          </Tab.Panel>
        )}
        <Tab.Panel id="operator-modules-panel">
          {/* TODO */}
          Modules panel
        </Tab.Panel>
        <Tab.Panel id="operator-riic-panel">
          <OperatorRiicPanel />
        </Tab.Panel>
        <Tab.Panel id="operator-misc-panel">
          {/* TODO */}
          Misc panel
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};
export default OperatorTabs;
