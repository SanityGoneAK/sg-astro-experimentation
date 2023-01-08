import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const spacer = style({
  display: "inline-block",
  backgroundColor: vars.colors.neutrals.midtoneBrighterer,
  height: spacing(0.5),
  width: spacing(0.5),
  borderRadius: "100%",
});
