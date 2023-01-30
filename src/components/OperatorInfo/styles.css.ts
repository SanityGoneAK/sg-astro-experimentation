import { style, styleVariants } from "@vanilla-extract/css";
import { rgba } from "polished";

import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const root = style({
  display: "grid",
  padding: spacing(3, 3, 2),
  gridTemplateRows: "auto auto",
  rowGap: spacing(1),
  background: `${rgba(rawColors.neutrals.midtone, 0.66)}`,
});

export const name = style({
  fontFamily: vars.typography.secondaryFontFamily,
  fontSize: "40px",
  fontWeight: "700",
  lineHeight: "1",
});

export const alterName = style({
  color: vars.colors.neutrals.gray,
  fontWeight: 400,
});

export const rarityClassBranch = style({
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "max-content",
  columnGap: spacing(1.5),
  alignItems: "center",
  justifyItems: "start",
});

export const rarityStars = style({
  display: "grid",
  gridAutoFlow: "column",
});

export const rarityClassBranchItem = style({
  display: "grid",
  gridAutoFlow: "column",
  alignItems: "center",
  columnGap: spacing(1),
});

export const classBranchIcon = style({
  height: 16,
  width: "100%",
});

export const position = style({
  color: vars.colors.neutrals.gray,
});

const baseLimitedText = style({
  position: "relative",
  display: "inline-block",
  marginRight: "6px",
  fontSize: "16px",
  fontWeight: 900,
  lineHeight: 1.5,
  fontStyle: "italic",
  textTransform: "uppercase",
  // @ts-expect-error webkit specific property for gradient text; !important is required here to work correctly when preceding `background`
  "-webkit-background-clip": "text !important",
  "-webkit-text-fill-color": "transparent",
});

export const limitedText = styleVariants({
  6: [baseLimitedText, { background: rawColors.gradients.orange }],
  5: [baseLimitedText, { background: rawColors.gradients.yellow }],
  4: [baseLimitedText, { background: rawColors.gradients.purple }],
  3: [baseLimitedText, { background: rawColors.gradients.sky }],
  2: [baseLimitedText, { background: rawColors.gradients.green }],
  1: [baseLimitedText, { background: rawColors.neutrals.white }],
});
