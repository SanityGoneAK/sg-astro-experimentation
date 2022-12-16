import { style, globalStyle } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  display: "block",
});

export const container = style({
  height: spacing(8),
  paddingLeft: spacing(3),
  display: "flex",
  alignItems: "center",
  color: vars.colors.neutrals.midtoneBrighterer,
  ":hover": {
    background: vars.colors.neutrals.midtoneDarker,
  },
});

export const active = style({
  background: vars.colors.neutrals.midtone,
  ":hover": {
    background: vars.colors.neutrals.midtone,
  },
  borderRight: `2px solid ${vars.colors.neutrals.white}`,
});

globalStyle(`${container} > svg`, {
  marginRight: spacing(3),
});

globalStyle(`${container} > svg > rect`, {
  stroke: vars.colors.neutrals.midtoneBrighterer,
});

globalStyle(`${container} > span`, {
  lineHeight: vars.typography.body2.lineHeight,
  fontSize: vars.typography.body2.fontSize,
});

globalStyle(`${active} > svg > rect`, {
  stroke: vars.colors.neutrals.white,
});

globalStyle(`${active} > span`, {
  color: vars.colors.neutrals.white,
});
