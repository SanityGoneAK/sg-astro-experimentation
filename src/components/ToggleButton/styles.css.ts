import { style } from "@vanilla-extract/css";
import { rgba } from "polished";
import { spacing } from "../../theme-helpers";
import { vars, rawColors } from "../../theme.css";

export const root = style({
  cursor: "pointer",
  padding: spacing(1, 2),
  background: "none",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: vars.typography.body1Bold.fontWeight,
  border: "none",
  borderRadius: 18,
  color: vars.colors.neutrals.white,
  selectors: {
    "&[aria-pressed='false']": {
      opacity: 0.8,
      outline: `1px solid ${rgba(rawColors.neutrals.white, 0.2)}`,
    },
    "&[aria-pressed='false']:hover": {
      opacity: 1,
      background: `${rgba(rawColors.neutrals.white, 0.1)}`,
      outline: `1px solid ${rgba(rawColors.neutrals.white, 0.5)}`,
    },
    "&[aria-pressed='true']": {
      background: vars.colors.neutrals.white,
      color: vars.colors.neutrals.black,
    },
  },
});
