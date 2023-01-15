import { style, styleVariants } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  display: "block",
});

const baseContainer = style({
  height: spacing(8),
  paddingLeft: spacing(3),
  display: "flex",
  alignItems: "center",
  color: vars.colors.neutrals.midtoneBrighterer,
});

export const container = styleVariants({
  inactive: [
    baseContainer,
    {
      ":hover": {
        background: vars.colors.neutrals.midtoneDarker,
      },
    },
  ],
  active: [
    baseContainer,
    {
      background: vars.colors.neutrals.midtone,
    },
  ],
});

export const active = style({
  background: vars.colors.neutrals.midtone,
  ":hover": {
    background: vars.colors.neutrals.midtone,
  },
  borderRight: `2px solid ${vars.colors.neutrals.white}`,
});

export const svg = style({
  marginRight: spacing(3),
});

export const rect = styleVariants({
  inactive: { stroke: vars.colors.neutrals.midtoneBrighterer },
  active: { stroke: vars.colors.neutrals.white },
});

export const linkText = styleVariants({
  inactive: {
    color: vars.colors.neutrals.midtoneBrighterer,
  },
  active: [
    {
      ...vars.newTypography.bodySemibold,
      color: vars.colors.neutrals.white,
    },
  ],
});
