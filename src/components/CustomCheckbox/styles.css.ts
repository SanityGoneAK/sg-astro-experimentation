import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

const base = style({
  display: "inline-grid",
  gridAutoFlow: "column",
  columnGap: spacing(1),
  alignItems: "center",
});

export const label = styleVariants({
  disabled: [
    base,
    {
      opacity: 0.3,
      cursor: "not-allowed",
    },
  ],
  enabled: [
    base,
    {
      cursor: "pointer",
    },
  ],
});

export const checkboxContainer = style({
  display: "grid",
  gridTemplateColumns: spacing(2),
  gridTemplateRows: spacing(2),
  alignItems: "center",
  justifyItems: "center",
  background: vars.colors.neutrals.black,
  borderRadius: spacing(0.5),
});

globalStyle(`${checkboxContainer} > *`, {
  gridRow: 1,
  gridColumn: 1,
});

export const checkboxInput = style({
  margin: 0,
  opacity: 0,
  width: spacing(2),
  height: spacing(2),
  selectors: {
    [`${label.enabled} &`]: {
      cursor: "pointer",
    },
    [`${label.disabled} &`]: {
      cursor: "not-allowed",
    },
  },
});

export const checkboxControl = style({
  width: "10px",
  height: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "3px",
  selectors: {
    [`${checkboxInput}:checked + &`]: {
      background: rawColors.gradients.sky,
    },
    [`${checkboxInput}:focus-visible + &`]: {
      boxShadow: `0 0 0 0.05em #fff, 0 0 0.15em 0.1em ${vars.colors.accents.sky}`,
    },
  },
});
