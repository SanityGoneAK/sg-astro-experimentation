import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

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

export const statsMaterialsContainer = style({
  padding: spacing(3),
  background: vars.colors.neutrals.darktone,
});
