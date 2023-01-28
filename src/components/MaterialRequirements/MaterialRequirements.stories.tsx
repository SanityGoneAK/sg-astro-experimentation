import MaterialRequirements from "./MaterialRequirements";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  component: MaterialRequirements,
} as ComponentMeta<typeof MaterialRequirements>;

const Template: ComponentStoryObj<typeof MaterialRequirements> = {
  args: {
    unlockCond: {
      phase: 2,
      level: 1,
    },
    itemCosts: [
      {
        id: "3303",
        count: 2,
        type: "MATERIAL",
      },
      {
        id: "30044",
        count: 1,
        type: "MATERIAL",
      },
      {
        id: "31023",
        count: 3,
        type: "MATERIAL",
      },
    ],
  },
};

export const PineconeS1Mastery1 = {
  ...Template,
};
