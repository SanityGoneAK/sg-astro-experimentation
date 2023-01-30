import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";

export const row = style({
  display: "flex",
  gap: spacing(0.25),
  marginBottom: spacing(0.25),
});
