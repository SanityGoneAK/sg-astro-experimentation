import { styleVariants } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const eliteIconPath = styleVariants({
  inactive: {},
  active: {
    fill: "url(#rarity5)",
  },
});

export const eliteZeroIconPath = styleVariants({
  inactive: {
    fill: "transparent",
    stroke: vars.colors.neutrals.midtoneBrighterer,
  },
  active: { fill: "transparent", stroke: vars.colors.neutrals.white },
});
