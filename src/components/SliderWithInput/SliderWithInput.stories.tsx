import SliderWithInput from "./SliderWithInput";

export default {
  component: SliderWithInput,
};
export const Level = {
  args: {
    type: "level",
    value: 1,
    max: 90,
  },
};

export const Skill = {
  args: {
    type: "skill",
    value: 1,
    max: 10,
  },
};
