import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { rawColors } from "../../theme.css";

export const knobsContainer = style({
  padding: spacing(3),
  background: `linear-gradient(to bottom, ${rawColors.neutrals.darktone}, ${rawColors.neutrals.midtoneDarker})`,
});
