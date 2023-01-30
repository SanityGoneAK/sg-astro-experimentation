import { style, styleVariants } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const base = style({
  height: spacing(8),
  width: spacing(8),
});

export const operatorPortrait = styleVariants({
  selector: [
    base,
    {
      position: "relative",
      ":after": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
        border: `1px solid ${vars.colors.neutrals.white}`,
        opacity: "0.5",
        borderRadius: spacing(0.5),
      },
    },
  ],
  map: [
    base,
    {
      borderRadius: spacing(12),
      overflow: "hidden",
    },
  ],
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
