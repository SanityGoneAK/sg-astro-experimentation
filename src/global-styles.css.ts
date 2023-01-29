import { globalStyle } from "@vanilla-extract/css";
import { rgba } from "polished";

import { spacing } from "./theme-helpers";
import { rawColors, vars } from "./theme.css";

// base typography styles
// and stable scrollbar width
globalStyle("html", {
  ...vars.newTypography.body,
  backgroundColor: vars.colors.neutrals.darktone,
  overflowY: "scroll",
  scrollbarWidth: "auto",
  scrollbarColor: `${rgba(rawColors.neutrals.white, 0.8)} transparent`,
});

globalStyle("a, a:link, a:visited", {
  textDecoration: "none",
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

// Josh W Comeau's CSS reset (with some tweaks):
// https://www.joshwcomeau.com/css/custom-css-reset/

// use border-box sizing everywhere
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

// remove default margins
globalStyle("*", {
  margin: 0,
});

// enable percentage based heights
globalStyle("html, body", {
  height: "100%",
});

globalStyle(":root", {
  // @ts-expect-error vanilla-extract doesn't like -webkit-font-smoothing
  "-webkit-font-smoothing": "antialiased",
});

// improve media sizing defaults
globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
});

// remove user-agent form typography
globalStyle("input, button, textarea, select", {
  font: "inherit",
});

// avoid text overflows
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});

globalStyle("img", {
  objectFit: "contain",
});
