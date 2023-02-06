import MapTileDefinitions from "./MapTileDefinitions";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  component: MapTileDefinitions,
} as ComponentMeta<typeof MapTileDefinitions>;

const Template: ComponentStoryObj<typeof MapTileDefinitions> = {
};

export const Default = {
  ...Template,
};
