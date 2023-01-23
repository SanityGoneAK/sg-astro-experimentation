import CharacterStats from "./CharacterStats";
import operatorsJson from "../../../data/operators.json";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  component: CharacterStats,
} as ComponentMeta<typeof CharacterStats>;

const ops = Object.values(operatorsJson);

const Template: ComponentStoryObj<typeof CharacterStats> = {
  args: {
    character: ops[0],
    elite: 2,
    level: 90,
  },
};

export const Default = {
  ...Template,
};
