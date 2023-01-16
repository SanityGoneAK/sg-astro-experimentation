import { useState } from "react";

import CustomCheckbox from "./CustomCheckbox";

import type { ComponentStoryObj } from "@storybook/react";

export default {
  component: CustomCheckbox,
};

const Template: ComponentStoryObj<typeof CustomCheckbox> = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CustomCheckbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        label="Trust Bonus"
      />
    );
  },
};

export const Default = {
  ...Template,
};

export const Disabled = {
  ...Template,
  args: {
    disabled: true,
  },
};
