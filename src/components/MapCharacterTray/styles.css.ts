import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const tray = style({
  background: vars.colors.neutrals.midtone,
  padding: spacing(1),
  minHeight: spacing(10),
  marginTop: spacing(4),
  borderTopLeftRadius: spacing(1),
  borderTopRightRadius: spacing(1),
  width: "100%",
});
