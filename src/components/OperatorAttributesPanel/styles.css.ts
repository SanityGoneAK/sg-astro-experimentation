import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const knobsContainer = style({
  padding: spacing(3),
  display: "grid",
  alignItems: "center",
  rowGap: spacing(2),
  background: `linear-gradient(to bottom, ${rawColors.neutrals.darktone}, ${rawColors.neutrals.midtoneDarker})`,
});

export const eliteAndLevel = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "center",
  columnGap: spacing(2),
});

export const trustPotentialModule = style({
  display: "grid",
  gridTemplateColumns: "auto auto 1fr",
  alignItems: "center",
  columnGap: spacing(3),
});

export const moduleKnobs = style({
  justifySelf: "end",
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1),
});

export const label = style({
  color: vars.colors.neutrals.gray,
});
