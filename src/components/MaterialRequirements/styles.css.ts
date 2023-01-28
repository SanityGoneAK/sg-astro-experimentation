import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { rgba } from "polished";

import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

const size = 52;

export const root = style({
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "min-content",
  columnGap: spacing(2),
  justifyItems: "start",
  alignItems: "center",
});

export const items = style({
  display: "grid",
  gridAutoFlow: "column",
  columnGap: spacing(1),
});

export const itemStack = style({
  display: "inline-grid",
  gridTemplateAreas: "'stack'",
  width: size,
  height: size,
});

globalStyle(`${itemStack} > *`, {
  gridArea: "stack",
});

const baseItemRarityBg = style({
  width: size,
  height: size,
  borderRadius: "50%",
  border: "2px solid",
});

export const itemRarityBg = styleVariants({
  4: [
    baseItemRarityBg,
    {
      borderColor: vars.colors.accents.yellowLight,
      backgroundColor: `${rgba(rawColors.accents.yellowLight, 0.33)}`,
    },
  ],
  3: [
    baseItemRarityBg,
    {
      borderColor: vars.colors.accents.purpleLight,
      backgroundColor: `${rgba(rawColors.accents.purpleLight, 0.33)}`,
    },
  ],
  2: [
    baseItemRarityBg,
    {
      borderColor: vars.colors.accents.skyLight,
      backgroundColor: `${rgba(rawColors.accents.skyLight, 0.33)}`,
    },
  ],
  1: [
    baseItemRarityBg,
    {
      borderColor: vars.colors.accents.greenLight,
      backgroundColor: `${rgba(rawColors.accents.greenLight, 0.33)}`,
    },
  ],
  0: [
    baseItemRarityBg,
    {
      borderColor: vars.colors.neutrals.white,
      backgroundColor: `${rgba(rawColors.neutrals.white, 0.33)}`,
    },
  ],
});

export const itemImage = style({
  width: size,
  height: size,
});

export const count = style({
  display: "inline-block",
  justifySelf: "end",
  alignSelf: "end",
  padding: spacing(0.25, 0.5),
  background: vars.colors.neutrals.blackest,
  borderRadius: spacing(1),
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1,
});

export const minEliteMinLevel = style({
  display: "grid",
  padding: spacing(1, 1.25),
  gridTemplateColumns: "16px auto",
  columnGap: spacing(1),
  background: `${rgba(rawColors.neutrals.midtoneBrighter, 0.33)}`,
  borderRadius: spacing(1),
  alignItems: "center",
});

export const minLevel = style({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1,
  background: rawColors.gradients.yellow,
  // @ts-expect-error webkit specific property for gradient text
  "-webkit-background-clip": "text",
  "-webkit-text-fill-color": "transparent",
});
