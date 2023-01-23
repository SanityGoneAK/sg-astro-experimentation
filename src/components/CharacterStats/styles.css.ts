import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const root = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "repeat(4, auto)",
  gridAutoFlow: "column",
  rowGap: spacing(2),
  columnGap: `calc(${spacing(6)} + 1px)`,
  color: vars.colors.neutrals.gray,
  "::after": {
    content: "",
    position: "absolute",
    left: 0,
    right: "50%",
    top: 0,
    bottom: 0,
    borderRight: "1px solid",
    borderColor: vars.colors.neutrals.midtone,
  },
});

export const dt = style({
  display: "inline-flex",
  alignItems: "center",
  columnGap: spacing(1),
});

export const iconPath = style({
  fill: vars.colors.neutrals.white,
});
