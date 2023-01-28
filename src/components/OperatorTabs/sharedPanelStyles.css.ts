import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const knobsContainer = style({
  padding: spacing(3),
  display: "grid",
  alignItems: "center",
  rowGap: spacing(2),
  background: `linear-gradient(to bottom, ${rawColors.neutrals.darktone}, ${rawColors.neutrals.midtoneDarker})`,
  borderBottom: "1px solid",
  borderBottomColor: vars.colors.neutrals.midtone,
});
