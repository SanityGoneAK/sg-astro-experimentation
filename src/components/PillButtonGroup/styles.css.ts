import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { rawColors, vars } from "../../theme.css";

export const root = style({
  display: "inline-flex",
  background: vars.colors.neutrals.black,
});

export const button = style({
  padding: "4.5px 10px",
  border: "none",
  borderRadius: spacing(1),
  fontFamily: "inherit",
  fontSize: "16px",
  lineHeight: "27px",
  fontWeight: "600",
  color: vars.colors.neutrals.midtoneBrighterer,
  background: "none",
  cursor: "pointer",
  selectors: {
    '&[aria-pressed="true"]': {
      color: vars.colors.neutrals.blackest,
      background: rawColors.gradients.purple,
    },
    "&:first-of-type": {
      borderTopLeftRadius: spacing(4),
      borderBottomLeftRadius: spacing(4),
    },
    "&:last-of-type": {
      borderTopRightRadius: spacing(4),
      borderBottomRightRadius: spacing(4),
    },
  },
});
