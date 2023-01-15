import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { sliderUnstyledClasses } from "@mui/base/SliderUnstyled";
import { rgba } from "polished";

import { breakpoints, spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const root = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  columnGap: spacing(2),
  alignItems: "center",
});

export const label = style({
  color: vars.colors.neutrals.gray,
});

const baseSlider = style({
  display: "inline-flex",
  marginRight: spacing(3), // ensures space for the slider thumb
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

export const slider = styleVariants({
  level: [baseSlider, {}],
  skill: [baseSlider, {}],
});

globalStyle(`${baseSlider} .${sliderUnstyledClasses.track}`, {
  display: "block",
  position: "absolute",
  height: "2px",
  borderRadius: spacing(0.25),
});

globalStyle(`${slider.level} .${sliderUnstyledClasses.track}`, {
  background: `linear-gradient(to right, ${rawColors.accents.yellow}, ${rawColors.accents.yellowLight})`,
});

globalStyle(`${slider.skill} .${sliderUnstyledClasses.track}`, {
  background: `linear-gradient(to right, ${rawColors.accents.sky}, ${rawColors.accents.skyLight})`,
});

globalStyle(`${baseSlider} .${sliderUnstyledClasses.rail}`, {
  display: "block",
  position: "absolute",
  width: "100%",
  height: "2px",
  background: vars.colors.neutrals.midtoneBrighter,
});

globalStyle(`${baseSlider} .${sliderUnstyledClasses.thumb}`, {
  position: "absolute",
  display: "grid",
  marginTop: 0,
  borderRadius: spacing(0.25),
  height: spacing(1),
  width: spacing(3),
  background: vars.colors.neutrals.gray,
});

globalStyle(`${baseSlider}:hover .${sliderUnstyledClasses.thumb}`, {
  outline: `12px solid ${rgba(rawColors.neutrals.white, 0.05)}`,
});

globalStyle(
  `${baseSlider} .${sliderUnstyledClasses.thumb}.${sliderUnstyledClasses.active}`,
  {
    outline: `12px solid ${rgba(rawColors.neutrals.white, 0.1)}`,
  }
);

globalStyle(
  `${baseSlider} .${sliderUnstyledClasses.thumb}.${sliderUnstyledClasses.focusVisible}`,
  {
    boxShadow: `0 0 0 0.05em #fff, 0 0 0.15em 0.1em ${vars.colors.accents.sky}`,
  }
);

export const sliderInput = style({
  boxSizing: "border-box",
  display: "inline-flex",
  width: spacing(6),
  margin: spacing(0, 0, 0, 1),
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
