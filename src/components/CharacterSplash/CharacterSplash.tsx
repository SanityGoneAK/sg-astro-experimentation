import React from "react";
import { Tab } from "@headlessui/react";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

export interface CharacterSplashProps {
  characterObject: OutputTypes.Character;
}

const CharacterSplash: React.FC<CharacterSplashProps> = ({}) => {
  return (
    <Tab.Group>
      <Tab.List>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};
export default CharacterSplash;
