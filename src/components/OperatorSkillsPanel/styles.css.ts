import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const root = style({});

export const skillDescription = style({});

globalStyle(`${skillDescription} .value-up`, {
  fontWeight: 700,
  color: vars.colors.accents.skyLight,
});

globalStyle(`${skillDescription} .value-down`, {
  fontWeight: 700,
  color: vars.colors.accents.redLight,
});

globalStyle(`${skillDescription} .skill-tooltip`, {
  color: vars.colors.neutrals.gray,
});
