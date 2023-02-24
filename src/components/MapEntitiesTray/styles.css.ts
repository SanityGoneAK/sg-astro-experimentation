import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const tray = style({
  background: vars.colors.neutrals.midtone,
  padding: spacing(1),
  minHeight: spacing(10),
  marginTop: spacing(4),
  borderTopLeftRadius: spacing(1),
  borderTopRightRadius: spacing(1),
  width: "100%",
  display: "flex",
  gap: spacing(1),
});

export const tokenGroup = style({
  position: "relative",
});

export const tokenQuantity = style({
  position: "absolute",
  background: vars.colors.neutrals.midtoneDarker,
  padding: spacing(0.5, 1),
  bottom: spacing(-1),
  right: spacing(-1),
  borderRadius: spacing(0.5),
});

export const addCharacter = style({
  width: spacing(8),
  height: spacing(8),
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  ":hover": {
    background: vars.colors.neutrals.midtoneBrighter,
  },
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
});
