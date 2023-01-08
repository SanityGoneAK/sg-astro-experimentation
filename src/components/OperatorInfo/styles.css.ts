import { style } from "@vanilla-extract/css";
import { rgba } from "polished";

import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  padding: spacing(3),
});

export const portraitNameRarity = style({
  display: "grid",
  gridTemplateColumns: "72px 1fr auto",
  columnGap: spacing(2),
  alignItems: "center",
});

export const portrait = style({
  width: 72,
  height: 72,
  borderRadius: spacing(1),
  background: `linear-gradient(to bottom, ${rawColors.neutrals.darktone}, ${rawColors.neutrals.midtoneDarker})`,
});

export const name = style({
  fontFamily: vars.typography.secondaryFontFamily,
});

export const baseName = style({
  margin: 0,
  fontSize: "40px",
  fontWeight: "600",
  lineHeight: "1",
});

export const alterName = style({
  margin: 0,
  paddingTop: spacing(0.5),
  color: vars.colors.neutrals.gray,
  fontSize: "20px",
  fontWeight: 400,
  lineHeight: 1,
});

export const classBranchTraitToggle = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "end",
});

export const classBranchNameAndIconWrapper = style({
  display: "flex",
  alignItems: "center",
  columnGap: spacing(1),
});

export const branchNameAndIconWrapper = style([
  classBranchNameAndIconWrapper,
  {
    paddingLeft: spacing(1),
  },
]);

export const classBranch = style({
  display: "flex",
  alignItems: "center",
  lineHeight: 1,
});

export const classBranchIcon = style({
  height: 16,
});

export const spacer = style({
  margin: spacing(0, 2),
});

export const position = style({
  color: vars.colors.neutrals.gray,
});

export const traitToggle = style({
  cursor: "pointer",
  padding: spacing(1, 2),
  background: "none",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: vars.typography.body1Bold.fontWeight,
  borderRadius: 18,
  selectors: {
    "&[aria-pressed='false']": {
      opacity: 0.8,
      color: vars.colors.neutrals.white,
      border: `1px solid ${rgba(rawColors.neutrals.white, 0.2)}`,
    },
    "&[aria-pressed='true']": {
      border: "none",
      background: vars.colors.neutrals.white,
      color: vars.colors.neutrals.black,
    },
  },
});

export const traitInfo = style({});
