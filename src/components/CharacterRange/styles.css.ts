import { globalStyle, style } from "@vanilla-extract/css";
import { spacing, breakpoints } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const rangeTable = style({
  flexShrink: 0,
});

export const rangeCell = style({
  width: spacing(2),
  height: spacing(2),
  boxSizing: "border-box",
  borderRadius: "2px",

  "@media": {
    [breakpoints.down("mobile")]: {
      width: spacing(1.5),
      height: spacing(1.5),
    },
  },
});

globalStyle(`${rangeCell}.active`, {
  border: `2px solid ${vars.colors.neutrals.gray}`,
});

globalStyle(`${rangeCell}.operator`, {
  backgroundColor: vars.colors.neutrals.white,
});
