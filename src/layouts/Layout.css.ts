import { style } from "@vanilla-extract/css";
import { transparentize } from "polished";

import { spacing } from "../theme-helpers";
import { rawColors, vars } from "../theme.css";

export const siteWrapper = style({
  display: "flex",
  flexDirection: "row",
  isolation: "isolate",
  height: "100%",
});

export const sidebar = style({
  width: spacing(28.5),
  flex: "none",
  display: "flex",
  flexDirection: "column",
  backgroundColor: vars.colors.neutrals.darktone,
  height: "100vh", // this is probably the objectively wrong way to do this
  borderRight: `1px solid ${vars.colors.neutrals.midtone}`,
});

export const mainbar = style({
  flexGrow: 1,
});

export const content = style({
  padding: spacing(3),
});

export const logoContainer = style({
  width: spacing(28.5),
  height: spacing(8),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: vars.colors.neutrals.midtoneDarker,
  borderBottom: `1px solid ${vars.colors.neutrals.midtone}`,
});

export const topbar = style({
  height: spacing(8),
  display: "flex",
  alignItems: "center",
  background: transparentize(0.34, rawColors.neutrals.darktone),
  backdropFilter: "blur(4px)",
  borderBottom: `1px solid ${vars.colors.neutrals.midtone}`,
});

export const searchBarContainer = style({
  marginLeft: spacing(3),
});

export const footer = style({
  flex: "none",
  margin: spacing(3),
  marginTop: "auto",
});

export const footerParagraph = style({
  color: vars.colors.neutrals.midtoneBrighterer,
  fontSize: vars.typography.body3.fontSize,
  lineHeight: 1.5,
});

export const footerLink = style({
  color: vars.colors.neutrals.gray,
  fontSize: vars.typography.body3.fontSize,
  lineHeight: 1.5,
  marginTop: spacing(3),
  display: "block",
});

export const footerLogos = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  columnGap: spacing(3),
});

export const hr = style({
  margin: spacing(3, 0),
  border: 0,
  borderBottom: `1px solid ${vars.colors.neutrals.midtone}`,
});
