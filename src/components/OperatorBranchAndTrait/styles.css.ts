import { style } from "@vanilla-extract/css";

export const hasTooltip = style({
  position: "relative",
  cursor: "help",
  "::after": {
    content: "",
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    borderBottom: "1px dashed",
    opacity: 0.33,
  },
});
