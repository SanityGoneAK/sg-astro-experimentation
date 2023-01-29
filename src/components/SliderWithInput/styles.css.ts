import { sliderUnstyledClasses } from "@mui/base/SliderUnstyled";
import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { rgba } from "polished";

import { breakpoints, spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

const thumbWidth = spacing(3);

export const root = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  columnGap: spacing(2),
  alignItems: "center",
});

export const label = style({
  color: vars.colors.neutrals.gray,
});

export const slider = style({
  display: "inline-flex",
  marginRight: thumbWidth,
  alignItems: "center",
  height: spacing(1),
  position: "relative",
  cursor: "pointer",
  "@media": {
    [breakpoints.down("mobile")]: {
      width: "100%",
      flexGrow: 1,
    },
  },
});

const baseTrack = style({
  display: "block",
  position: "absolute",
  height: "2px",
  borderRadius: spacing(0.25),
});

export const track = styleVariants({
  level: [
    baseTrack,
    {
      background: `linear-gradient(to right, ${rawColors.accents.yellow}, ${rawColors.accents.yellowLight})`,
    },
  ],
  skill: [
    baseTrack,
    {
      background: `linear-gradient(to right, ${rawColors.accents.sky}, ${rawColors.accents.skyLight})`,
    },
  ],
});

export const rail = style({
  display: "block",
  position: "absolute",
  width: `calc(100% + ${thumbWidth})`,
  height: "2px",
  background: vars.colors.neutrals.midtoneBrighter,
});

export const thumb = style({
  boxSizing: "content-box",
  position: "absolute",
  display: "grid",
  margin: "0 -12px",
  padding: "12px",
  height: spacing(1),
  width: thumbWidth,
  borderRadius: "12px",
  outlineOffset: "-12px",
  "::after": {
    content: "",
    borderRadius: spacing(0.25),
    background: vars.colors.neutrals.gray,
  },
});

globalStyle(
  `${slider}:hover .${sliderUnstyledClasses.thumb}:not(.${sliderUnstyledClasses.active})`,
  {
    outline: `12px solid ${rgba(rawColors.neutrals.white, 0.05)}`,
  }
);

export const thumbActive = style({
  outline: `12px solid ${rgba(rawColors.neutrals.white, 0.1)}`,
});

export const inputContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, auto)",
  columnGap: spacing(1),
  alignItems: "center",
});

export const input = style({
  boxSizing: "border-box",
  display: "inline-flex",
  width: spacing(6),
  padding: spacing(1, 2),
  background: vars.colors.neutrals.black,
  ...vars.newTypography.body,
  borderRadius: "18px",
  border: "none",
  textAlign: "center",
  ":focus-visible": {
    outline: "none",
    boxShadow: `0 0 0 0.05em #fff, 0 0 0.15em 0.1em ${vars.colors.accents.sky};`,
  },
});
