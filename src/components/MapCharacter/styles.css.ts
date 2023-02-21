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
      background: "none",
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
      borderRightColor: "#FED874",
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
      borderLeftColor: "#FED874",
    },
  ],
});

export const menuSelector = style({
  width: spacing(16),
  height: spacing(16),
  left: "-50%",
  top: "-50%",
  position: "absolute",
  zIndex: 500,
  pointerEvents: "all",
});

export const removeCharacter = style({
  background: vars.colors.accents.red,
  position: "absolute",
  border: "none",
  width: spacing(6),
  height: spacing(6),
  left: 0,
  top: 0,
});

export const skill = style({
  background: vars.colors.accents.red,
  padding: "0",
  position: "absolute",
  border: "none",
  width: spacing(6),
  height: spacing(6),
  bottom: 0,
  right: 0,
})

export const selectorRing = style({
  transform: "rotateZ(45deg)",
  border: "solid 4px #E8E8F2",
  width: spacing(16),
  height: spacing(16),
})