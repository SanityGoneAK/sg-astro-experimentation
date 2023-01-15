import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { rawColors } from "../../theme.css";

export const knobsContainer = style({
  padding: spacing(3),
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  columnGap: spacing(2),
  background: `linear-gradient(to bottom, ${rawColors.neutrals.darktone}, ${rawColors.neutrals.midtoneDarker})`,
});
