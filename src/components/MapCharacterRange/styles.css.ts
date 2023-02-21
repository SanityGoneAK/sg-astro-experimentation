import { style, styleVariants } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const skillContainer = style({
  position: "absolute",
});

export const skillRow = style({
  display: "flex",
  gap: spacing(0.25),
  marginBottom: spacing(0.25),
});

export const cellBase = style({
  height: spacing(8),
  width: spacing(8),
});

export const cell = styleVariants({
  operator: [cellBase],
  active: [
    cellBase,
    { background: vars.colors.accents.yellowLight, opacity: 0.4 },
  ],
  empty: [cellBase, {}],
});
