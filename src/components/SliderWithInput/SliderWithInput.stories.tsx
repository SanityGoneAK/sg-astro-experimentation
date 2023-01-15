import SliderWithInput from "./SliderWithInput";

import type { ComponentStoryObj } from "@storybook/react";
import { useState } from "react";

export default {
  component: SliderWithInput,
};

const Template: ComponentStoryObj<typeof SliderWithInput> = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ maxWidth: "400px" }}>
        <SliderWithInput {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Level = {
  ...Template,
  args: {
    type: "level",
    value: 1,
    max: 90,
  },
};

export const Skill = {
  ...Template,
  args: {
    type: "skill",
    value: 1,
    max: 10,
  },
};
