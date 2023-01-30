import MapCharacter from "./MapCharacter";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

export default {
  component: MapCharacter,
} as ComponentMeta<typeof MapCharacter>;

const Template: ComponentStoryObj<typeof MapCharacter> = {
};

export const Default = {
  ...Template,
};
