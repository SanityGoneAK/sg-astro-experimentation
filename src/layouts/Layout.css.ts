import { globalStyle, style } from "@vanilla-extract/css";
import { rgba, tint, transparentize } from "polished";
import { breakpoints, spacing } from "../theme-helpers";
import { rawColors, vars } from "../theme.css";

const defaultBlendPoint = "576px";

export const siteWrapper = style({
  display: "flex",
  flexDirection: "row",
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
export const navigation = style({});
export const footer = style({
  flex: "none",
  margin: spacing(3),
  marginTop: "auto",
});
export const footerLogos = style({
  marginBottom: spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
export const discordLogo = style({
  marginRight: spacing(3),
});
globalStyle(`${footer} > p`, {
  color: vars.colors.neutrals.midtoneBrighterer,
  fontSize: vars.typography.body3.fontSize,
  lineHeight: 1.5,
});
globalStyle(`${footer} > a`, {
  color: vars.colors.neutrals.gray,
  fontSize: vars.typography.body3.fontSize,
  lineHeight: 1.5,
  marginTop: spacing(3),
  display: "block",
});
globalStyle(`${footer} hr`, {
  border: 0,
  borderBottom: `1px solid ${vars.colors.neutrals.midtone}`,
});

globalStyle(":root", {
  // @ts-expect-error vanilla-extract doesn't like -webkit-font-smoothing
  "-webkit-font-smoothing": "antialiased",
});

// FIXME temporary
globalStyle("body", {
  margin: 0,
});

globalStyle("html", {
  ...vars.newTypography.body,
  backgroundColor: vars.colors.neutrals.darktone,
  overflowY: "scroll",
  scrollbarWidth: "auto",
  scrollbarColor: `${rgba(rawColors.neutrals.white, 0.8)} transparent`,
  "@media": {
    [breakpoints.down("mobile")]: {
      fontSize: vars.typography.body2.fontSize,
    },
  },
});

globalStyle("html, body", {
  height: "100%",
});

globalStyle("b, strong", {
  fontWeight: vars.typography.body1Bolder.fontWeight,
});

globalStyle("a, a:link, a:visited", {
  textDecoration: "none",
});

globalStyle(".emphasized-link", {
  display: "inline-block",
  padding: spacing(0, 0.5),
  borderRadius: spacing(0.25),
  transition: "all 50ms ease-out",
  color: rgba(tint(0.27, rawColors.accents.sky), 0.66),
  backgroundColor: rgba(rawColors.accents.sky, 0.08),
});

globalStyle(".emphasized-link:hover", {
  color: tint(0.27, rawColors.accents.sky),
  backgroundColor: rgba(rawColors.accents.sky, 0.4),
});

globalStyle(".visually-hidden:not(:focus):not(:active)", {
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
});

globalStyle("dl > div", {
  padding: spacing(2),
  backgroundColor: vars.colors.neutrals.midtoneDarker,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "@media": {
    [breakpoints.down("mobile")]: {
      padding: spacing(1.5, 2),
      flexDirection: "row",
      alignItems: "center",
    },
  },
});

globalStyle("dl dt", {
  display: "flex",
  alignItems: "center",
  color: vars.colors.neutrals.gray,
  ...vars.typography.body3,
});

globalStyle("dl dt svg", {
  marginRight: spacing(1),
});

globalStyle("dl dd", {
  margin: spacing(1, 0, 0),
  ...vars.typography.generalHeadingBold,
  "@media": {
    [breakpoints.down("mobile")]: {
      margin: 0,
      ...vars.typography.skillTalentHeading,
    },
  },
});

globalStyle("p", {
  margin: spacing(3, 0, 0),
  "@media": {
    [breakpoints.down("mobile")]: {
      margin: spacing(2, 0, 0),
    },
  },
});

globalStyle(
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button",
  {
    // @ts-expect-error vanilla-extract doesn't like -webkit-appearance
    "-webkit-appearance": "none",
    margin: 0,
  }
);

globalStyle("input[type=number]", {
  // @ts-expect-error vanilla-extract doesn't like -moz-appearance
  "-moz-appearance": "textfield",
});

globalStyle("img", {
  objectFit: "contain",
});

globalStyle("body::-webkit-scrollbar", {
  width: spacing(2),
});

globalStyle("body::-webkit-scrollbar-thumb", {
  borderRadius: spacing(1),
  border: `${spacing(0.5)} solid transparent`,
  backgroundClip: "content-box",
  backgroundColor: rgba(rawColors.neutrals.white, 0.3),
});

globalStyle("body::-webkit-scrollbar-thumb:hover", {
  backgroundColor: rgba(rawColors.neutrals.white, 0.5),
});

globalStyle("body::-webkit-scrollbar-thumb:active", {
  backgroundColor: rgba(rawColors.neutrals.white, 0.8),
});
