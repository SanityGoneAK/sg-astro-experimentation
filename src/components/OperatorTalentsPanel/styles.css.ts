import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const knobsContainer = style({
  display: "flex",
  padding: spacing(3),
  background: vars.colors.gradients.dark,
  borderBottom: `1px solid ${vars.colors.neutrals.midtone}`,
});

export const potentialDropwdown = style({
  marginLeft: "auto",
});
