import { style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const root = style({
  display: "grid",
  gridTemplateAreas: `
    "portrait     name         limited"
    "class-branch class-branch trait-toggle"
    "trait-info   trait-info   trait-info"
  `,
  gridTemplateColumns: "72px 1fr auto",
});

export const portrait = style({
  gridArea: "potrait",
  width: 72,
  height: 72,
  objectFit: "contain",
});

export const name = style({
  gridArea: "name",
  fontFamily: vars.typography.secondaryFontFamily,
});

export const baseName = style({});

export const alterName = style({});

export const classBranch = style({
  gridArea: "class-branch",
  display: "flex",
});

export const traitToggle = style({
  gridArea: "trait-toggle",
});

export const traitInfo = style({
  gridArea: "trait-info",
});
