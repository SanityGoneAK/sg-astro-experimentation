import { useState } from "react";
import EliteButtonGroup from "./EliteButtonGroup";
import SvgRarityGradientDefs from "../SvgRarityGradientDefs";

import type { ComponentStoryObj } from "@storybook/react";

export default { component: EliteButtonGroup };

export const Default: ComponentStoryObj<typeof EliteButtonGroup> = {
  args: {
    maxElite: 2,
    currentElite: 0,
  },
  render: (args) => {
    const [elite, setElite] = useState(args.currentElite);
    return (
      <>
        <EliteButtonGroup {...args} currentElite={elite} onChange={setElite} />
        <SvgRarityGradientDefs />
      </>
    );
  },
};
