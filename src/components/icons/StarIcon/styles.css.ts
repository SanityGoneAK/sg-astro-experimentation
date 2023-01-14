import { styleVariants } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";

export const rarity = styleVariants({
  6: {
    fill: "url(#rarity6)",
  },
  5: {
    fill: "url(#rarity5)",
  },
  4: {
    fill: "url(#rarity4)",
  },
  3: {
    fill: "url(#rarity3)",
  },
  2: {
    fill: "url(#rarity2)",
  },
  1: {
    fill: vars.colors.neutrals.white,
  },
});
