import { left } from "@popperjs/core";
import { style, styleVariants } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";

const tileBase = style({
  position: "relative",
});

export const tile = styleVariants({
  default: [tileBase],
  drop: [
    tileBase,
    {
      ":before": {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "yellow",
        opacity: 0.3,
      },
    },
  ],
});

export const coordinate = style({
  position: "absolute",
  top: spacing(1),
  left: spacing(1),
  opacity: 0.5,
});
export const character = style({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: spacing(8),
  height: spacing(8),
  transform: "translate(-50%, -50%)",
  zIndex: "50",
  //   width: spacing(7),
  //   height: spacing(7),
  //   borderRadius: spacing(10),
  //   border: "4px solid red",
  //   overflow: "hidden",
});
