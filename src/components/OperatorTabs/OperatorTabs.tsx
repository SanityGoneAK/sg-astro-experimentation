import { Tab } from "@headlessui/react";
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
        {["Attributes", "Talents", "Skills", "Modules", "RIIC", "Misc"].map(
          (label) => {
            return <Tab.Panel key={label}>{label} panel</Tab.Panel>;
          }
        )}
      </Tab.Panels>
    </Tab.Group>
  );
};
export default OperatorTabs;
