import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";

export const root = style({
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1.5),
});

export const buttonGroup = style({
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1),
});

export const eliteButton = style({
  padding: spacing(0.5),
  border: "none",
  background: "none",
  cursor: "pointer",
});
