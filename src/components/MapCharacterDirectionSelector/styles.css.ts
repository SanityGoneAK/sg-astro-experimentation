import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";

export const directionSelector = style({
  border: "solid 4px #E8E8F2",
  width: spacing(16),
  height: spacing(16),
  left: "-50%",
  top: "-50%",
  position: "absolute",
  zIndex: 500,
  display: "grid",
  gap: spacing(1),
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  transform: "rotateZ(45deg)",
});

export const directionHandleWrapper = style({
  width: spacing(24),
  height: spacing(24),
  left: "-100%",
  top: "-100%",
  position: "absolute",
  zIndex: 550,
  // transform: "rotateZ(45deg)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const directionHandle = style({
  width: spacing(8),
  height: spacing(8),
  // position: "absolute",
  zIndex: 550,
  backgroundColor: "#A7E855",
  borderRadius: spacing(12),
  // left: "25%",
  // top: "25%",
});

export const directionZone = style({
  background: "#D3FF9B",
  opacity: 0.6,
});
