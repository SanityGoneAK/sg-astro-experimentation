import { style, globalStyle } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  padding: spacing(1),
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
});

export const icon = style({
  marginRight: spacing(1.5),
});

export const text = style({
  marginTop: 2,
});

globalStyle(`${text} > path`, {
  fill: vars.colors.neutrals.white,
});
