import { style, styleVariants } from "@vanilla-extract/css";
import { borderStyle } from "polished";
import { spacing } from "../../theme-helpers";

export const base = style({
  height: spacing(8),
  width: spacing(8),
});

const directionBase = style({
  borderWidth: spacing(0.5),
  borderRadius: spacing(50),
  width: "100%",
  height: "100%",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  borderColor: "#E8E8F2",
  borderStyle: "solid",
});

export const direction = styleVariants({
  north: [
    directionBase,
    {
      borderTopColor: "#FED874",
    },
  ],
  east: [
    directionBase,
    {
      borderLeftColor: "#FED874",
    },
  ],
  south: [
    directionBase,
    {
      borderBottomColor: "#FED874",
    },
  ],
  west: [
    directionBase,
    {
      borderRightColor: "#FED874",
    },
  ],
});
