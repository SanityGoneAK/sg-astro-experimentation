import { globalStyle, style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  padding: spacing(3, 0, 0),
  gridTemplateColumns: "auto 1fr",
  columnGap: spacing(2),
  alignItems: "center",
  selectors: {
    "&:not([hidden])": {
      display: "grid",
    },
  },
});

export const icon = style({
  height: 32,
  width: "100%",
});

globalStyle(`${root} .keyword`, {
  color: vars.colors.accents.blue,
  fontWeight: vars.typography.body1Bolder.fontWeight,
});
