import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const card = style({
  padding: spacing(3, 0),
  margin: spacing(0, 3),
  selectors: {
    ["&:not(:first-of-type)"]: {
      borderTop: `1px solid ${vars.colors.neutrals.midtone}`,
    },
  },
});

export const titleSection = style({
  display: "flex",
  gap: spacing(2),
  marginBottom: spacing(3),
});

export const talentNumber = style({
  padding: spacing(0.5, 1),
  backgroundColor: vars.colors.neutrals.midtoneBrighter,
});

export const title = style({
  fontFamily: vars.newTypography.header3.fontFamily,
  fontSize: vars.newTypography.header3.fontSize,
  fontWeight: vars.newTypography.header3.fontWeight,
  lineHeight: vars.newTypography.header3.lineHeight,
});

export const description = style({
  fontSize: vars.newTypography.body.fontSize,
  fontWeight: vars.newTypography.body.fontWeight,
  lineHeight: vars.newTypography.body.lineHeight,
});
