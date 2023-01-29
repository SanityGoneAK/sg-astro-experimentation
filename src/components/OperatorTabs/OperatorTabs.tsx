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
            <Tab key={label} className={classes.tabListButton}>
              {label}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <OperatorAttributesPanel />
        </Tab.Panel>
        <Tab.Panel>
          <OperatorTalentsPanel />
        </Tab.Panel>
        {operator.skillData.length > 0 && (
          <Tab.Panel>
            <OperatorSkillsPanel />
          </Tab.Panel>
        )}
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
