import MaterialRequirements from "./MaterialRequirements";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  component: MaterialRequirements,
} as ComponentMeta<typeof MaterialRequirements>;

const Template: ComponentStoryObj<typeof MaterialRequirements> = {
  args: {
    minElite: 1,
    minLevel: 80,
    itemCosts: [
      // LMD x 180k
      {
        id: "4001",
        count: 180000,
      },
      // Diketon r0 x 25
      {
        id: "30051",
        count: 25,
      },
      // Orirock Cube r1 x 10
      {
        id: "30012",
        count: 10,
      },
      // Integrated Device r2 x3
      {
        id: "30063",
        count: 3,
      },
      // White Horse Kohl r3 x 5
      {
        id: "30074",
        count: 5,
      },
      // Bipolar Nanoflake r4 x 1
      {
        id: "30125",
        count: 1,
      },
    ],
  },
};

export const Default = {
  ...Template,
};
