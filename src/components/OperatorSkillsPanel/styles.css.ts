import { globalStyle, style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const knobs = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  columnGap: spacing(2),
});

export const skillSelect = style({
  display: "grid",
  gridAutoFlow: "column",
  columnGap: spacing(1),
  color: vars.colors.neutrals.gray,
  alignItems: "center",
});

export const skillData = style({
  display: "grid",
  padding: spacing(3),
  rowGap: spacing(3),
});

export const skillIconNameAndType = style({
  display: "grid",
  gridTemplateAreas: `
    "icon        name"
    "icon        skilltype"
  `,
  gridTemplateColumns: "64px 1fr",
  alignItems: "center",
  columnGap: spacing(2),
});

export const skillName = style({
  gridArea: "name",
});

export const skillIcon = style({
  gridArea: "icon",
  width: 64,
  height: 64,
  borderRadius: spacing(0.5),
});

export const skillType = style({
  gridArea: "skilltype",
  display: "grid",
  gridAutoFlow: "column",
  justifyContent: "start",
  columnGap: spacing(1),
});

export const skillTypeItem = style({
  display: "inline-grid",
  padding: spacing(0.5, 1),
  gridAutoFlow: "column",
  columnGap: spacing(1),
  background: vars.colors.neutrals.midtoneDarker,
});

export const skillSpType = style({
  display: "grid",
  gridAutoFlow: "column",
  columnGap: `calc(${spacing(6)} + 1px)`,
});

export const skillSpTypeItem = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "auto auto 1fr",
  alignItems: "center",
  justifyItems: "end",
  columnGap: spacing(1),
  selectors: {
    "& ~ &::before": {
      content: "",
      position: "absolute",
      left: spacing(-3),
      top: 0,
      bottom: 0,
      borderLeft: "1px solid",
      borderColor: vars.colors.neutrals.midtone,
    },
  },
});

export const skillDescription = style({});

globalStyle(`${skillDescription} .value-up`, {
  fontWeight: 700,
  color: vars.colors.accents.skyLight,
});

globalStyle(`${skillDescription} .value-down`, {
  fontWeight: 700,
  color: vars.colors.accents.redLight,
});

globalStyle(`${skillDescription} .skill-tooltip`, {
  color: vars.colors.neutrals.gray,
});

export const skillRange = style({});
