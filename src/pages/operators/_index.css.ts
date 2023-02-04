import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const h1 = style({
  marginBottom: spacing(3),
});

export const operatorList = style({
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  listStyleType: "none",
  columnGap: spacing(1),
  rowGap: spacing(2),
});

export const operatorCard = style({
  display: "flex",
  flexDirection: "column-reverse",
  rowGap: spacing(1),
  color: vars.colors.neutrals.white,
});
