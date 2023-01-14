import { styleVariants } from "@vanilla-extract/css";

export const rarity = styleVariants({
  6: {
    fill: "url(#rarity6)",
  },
  5: {
    fill: "url(#rarity5)",
  },
  4: {},
  3: {},
  2: {},
  1: {},
});
