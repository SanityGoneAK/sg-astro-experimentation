import { style } from "@vanilla-extract/css";
import { breakpoints, spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const modalBackDrop = style({
  position: "fixed",
  inset: 0,
  background: vars.colors.neutrals.black,
  opacity: 0.6,
  width: "100%",
  height: "100%",
});

export const modalDialog = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: spacing(4),
});

export const modalPanel = style({
  background: vars.colors.neutrals.midtone,
  padding: spacing(2),
  borderRadius: spacing(1),
  boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.25)",
  minHeight: spacing(40),
});

export const input = style({
  background: "none",
  border: "none",
  flex: "1 1 0",
  color: vars.colors.neutrals.white,
  margin: spacing(2, 0),
  width: "100%",
  fontSize: vars.typography.body2.fontSize,
  backgroundColor: vars.colors.neutrals.midtoneDarker,
  padding: spacing(1),
  borderRadius: spacing(1),
  selectors: {
    "&:focus": {
      outline: "none",
    },
  },
  "@media": {
    [breakpoints.down("mobile")]: {
      fontSize: vars.typography.skillTalentHeading.fontSize,
    },
  },
  fontFamily: "inherit",
});

export const classButtonGroup = style({
  display: "flex",
  gap: spacing(1),
});

export const classButton = style({
  width: spacing(8),
  height: spacing(8),
  padding: spacing(1),
  margin: "0",
  background: vars.colors.neutrals.midtoneDarker,
  border: "none",
  borderRadius: spacing(0.5),
  cursor: "pointer",
  borderColor: "transparent",
  borderWidth: "2px",
  borderStyle: "solid",
  ":hover": {
    background: vars.colors.neutrals.midtoneBrighter,
    borderColor: vars.colors.neutrals.midtoneBrighterer,
  },
});

export const operatorResultList = style({
  padding: "0",
  listStyle: "none",
});

export const operatorResultOption = style({
  display: "flex",
});

export const operatorResultImage = style({
  width: spacing(8),
  height: spacing(8),
});
