import { style, styleVariants } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const options = style({
  margin: 0,
  padding: spacing(1, 0, 0, 0),
  listStyle: "none",
  boxShadow: vars.shadows.baseShadow,
  selectors: {
    "&:focus:not(:focus-visible)": {
      outline: "none",
    },
  },
});

export const dropdownIcon = style({
  marginTop: "2px",
});

export const baseOption = style({
  display: "grid",
  gridTemplateColumns: "max-content",
  gridAutoFlow: "column",
  alignItems: "center",
  columnGap: spacing(1),
  padding: spacing(1, 1.5),
  fontSize: vars.typography.dropdownOption.fontSize,
  lineHeight: vars.typography.dropdownOption.lineHeight,
  fontWeight: vars.typography.dropdownOption.fontWeight,
  background: vars.colors.neutrals.midtoneBrighter,
  cursor: "pointer",
  whiteSpace: "nowrap",
});

export const option = style([
  baseOption,
  {
    selectors: {
      '&[data-headlessui-state~="active"], &:hover': {
        backgroundColor: vars.colors.neutrals.midtoneBrighterer,
      },
      "&:first-child": {
        borderTopLeftRadius: spacing(2.25),
        borderTopRightRadius: spacing(2.25),
      },
      "&:last-child": {
        borderBottomLeftRadius: spacing(2.25),
        borderBottomRightRadius: spacing(2.25),
      },
    },
  },
]);

export const button = style([
  baseOption,
  {
    height: spacing(5),
    color: "inherit",
    border: "none",
    borderRadius: spacing(2.25),
    boxShadow: vars.shadows.baseShadow,
    selectors: {
      "&:disabled": {
        cursor: "not-allowed",
        color: vars.colors.neutrals.midtoneBrighterer,
        backgroundColor: vars.colors.neutrals.darktone,
      },
      "&:not(:disabled):hover": {
        backgroundColor: vars.colors.neutrals.midtoneBrighterer,
      },
    },
  },
]);

export const transition = styleVariants({
  base: {
    zIndex: 50,
    transition: "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  enterFrom: {
    opacity: 0,
  },
  enterTo: {
    opacity: 1,
  },
  leaveFrom: {
    opacity: 1,
  },
  leaveTo: {
    opacity: 0,
  },
});
