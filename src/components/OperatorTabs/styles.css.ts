import { style } from "@vanilla-extract/css";
import { rgba } from "polished";

import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const tabList = style({
  display: "grid",
  padding: spacing(0, 2, 1),
  gridTemplateColumns: "repeat(5, auto) 1fr",
  columnGap: spacing(1),
  background: rgba(rawColors.neutrals.midtone, 0.66),
});

export const tabListButton = style({
  position: "relative",
  appearance: "none",
  padding: spacing(1, 1),
  background: "none",
  border: "none",
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "23px",
  color: vars.colors.neutrals.midtoneBrighterer,
  // FIXME remove this when the focus-visible issue is fixed
  outline: "none",
  selectors: {
    // FIXME does not work, need to use a focus-visible polyfill instead
    // "&:focus:not(:focus-visible)": {
    //   outline: "none",
    // },
    "&:last-child": {
      justifySelf: "end",
    },
    '&[data-headlessui-state="selected"]': {
      color: vars.colors.neutrals.white,
    },
    '&[data-headlessui-state="selected"]::after': {
      content: "",
      position: "absolute",
      left: spacing(1),
      right: spacing(1),
      bottom: spacing(-1),
      height: 0,
      outline: "none",
      border: `1px solid ${vars.colors.neutrals.white}`, // renders as a 2px solid line
      boxShadow: `0px -4px 16px ${vars.colors.neutrals.white}`, // halo effect
    },
  },
});
