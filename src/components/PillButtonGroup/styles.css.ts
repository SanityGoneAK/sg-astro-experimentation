import { style } from "@vanilla-extract/css";
import { rgba } from "polished";
import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

const buttonTypography = {
  fontFamily: "inherit",
  fontSize: "16px",
  lineHeight: "27px",
  fontWeight: "600",
};

export const root = style({
  display: "inline-block",
  position: "relative",
  isolation: "isolate",
  width: "fit-content",
});

export const buttonWrapper = style({
  display: "inline-block",
  borderRadius: spacing(4),
  background: vars.colors.neutrals.black,
});

export const button = style({
  position: "relative",
  zIndex: 2,
  padding: "4.5px 10px",
  border: "none",
  borderRadius: spacing(1),
  ...buttonTypography,
  color: vars.colors.neutrals.midtoneBrighterer,
  background: "none",
  cursor: "pointer",
  transition: "color 200ms, background-color 200ms",
  selectors: {
    '&:not([aria-pressed="true"]):hover': {
      color: vars.colors.accents.purple,
      background: `${rgba(rawColors.accents.purple, 0.1)}`,
    },
    '&[aria-pressed="true"]': {
      color: vars.colors.neutrals.blackest,
    },
    "&:first-of-type": {
      borderTopLeftRadius: spacing(4),
      borderBottomLeftRadius: spacing(4),
    },
    "&:last-of-type": {
      borderTopRightRadius: spacing(4),
      borderBottomRightRadius: spacing(4),
    },
  },
});

export const thumbContainer = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "inline-block",
  overflow: "hidden",
  borderRadius: spacing(4),
  zIndex: 1,
});

export const thumb = style({
  position: "absolute",
  left: 0,
  display: "inline-block",
  height: "100%",
  width: "1px",
  background: rawColors.gradients.purple,
  transition: "all 0", // this will be overriden by js later
  transformOrigin: "center left",
  ...buttonTypography,
});

export const thumbLeft = style([
  thumb,
  {
    borderRadius: spacing(1, 0, 0, 1),
    width: spacing(1),
  },
]);

export const thumbRight = style([
  thumb,
  {
    borderRadius: spacing(0, 1, 1, 0),
    width: spacing(1),
  },
]);
