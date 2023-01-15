import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1.5),
});

export const label = style({
  color: vars.colors.neutrals.gray,
});

export const buttonGroup = style({
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1),
});

const baseEliteButton = style({
  padding: spacing(0.5),
  border: "none",
  background: "none",
  cursor: "pointer",
  lineHeight: 0,
});

export const eliteButton = styleVariants({
  zero: [baseEliteButton, {}],
  oneTwo: [baseEliteButton, {}],
});

// n.b. we put hover styles here and not in eliteIcon
// because we want the hover target to be the entire button, not just the svg/path
globalStyle(`${eliteButton.zero}[aria-pressed="false"]:hover svg path`, {
  stroke: vars.colors.neutrals.gray,
});

globalStyle(`${eliteButton.oneTwo}[aria-pressed="false"]:hover svg path`, {
  fill: vars.colors.neutrals.gray,
});
