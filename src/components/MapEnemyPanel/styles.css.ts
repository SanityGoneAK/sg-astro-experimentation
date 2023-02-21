import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  display: "flex",
  gap: spacing(2),
  width: "100%",
  background: vars.colors.neutrals.midtone,
  padding: spacing(1),
  margin: spacing(1, 0),
  borderRadius: spacing(1),
});

export const enemyPortrait = style({
  display: "flex",
  gap: spacing(1),
  alignItems: "center",
});

export const enemyPortraitImage = style({
  borderRadius: spacing(2),
});

export const enemyCount = style({
  ...vars.newTypography.header3,
});

export const attributesList = style({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  width: "100%",
});

export const attributeTitle = style({
  color: vars.colors.neutrals.gray,
});

export const attributeDetail = style({
  ...vars.newTypography.headerSemibold,
});

export const attribute = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});
