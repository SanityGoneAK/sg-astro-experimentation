import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const row = style({
  display: "flex",
  gap: spacing(0.25),
  marginBottom: spacing(0.25),
  width: "fit-content",
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderColor: vars.colors.neutrals.midtone,
  borderRadius: spacing(1),
  borderWidth: spacing(0.5),
  borderStyle: "solid",
  paddingTop: spacing(4),
  position: "relative",
});
