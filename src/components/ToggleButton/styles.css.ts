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
  lineHeight: "20px",
  margin: "-2px", // to compensate for 1px transparent border
  border: "1px solid transparent",
  borderRadius: 18,
  color: vars.colors.neutrals.white,
  selectors: {
    "&[aria-pressed='false']": {
      opacity: 0.8,
      border: `1px solid ${rgba(rawColors.neutrals.white, 0.2)}`,
    },
    "&[aria-pressed='false']:hover": {
      opacity: 1,
      background: `${rgba(rawColors.neutrals.white, 0.1)}`,
      border: `1px solid ${rgba(rawColors.neutrals.white, 0.5)}`,
    },
    "&[aria-pressed='true']": {
      background: vars.colors.neutrals.white,
      color: vars.colors.neutrals.black,
    },
  },
});
