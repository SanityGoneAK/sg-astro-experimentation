import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const tabList = style({
  display: "grid",
  padding: spacing(0, 2, 1),
  gridTemplateColumns: "repeat(5, auto) 1fr",
  columnGap: spacing(1),
});

export const tabListButton = style({
  position: "relative",
  appearance: "none",
  padding: spacing(1, 1),
  background: "none",
  border: "none",
  textTransform: "uppercase",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "23px",
  color: vars.colors.neutrals.midtoneBrighterer,
  selectors: {
    "&:focus:not(:focus-visible)": {
      outline: "none",
    },
    "&:last-child": {
      justifySelf: "end",
    },
    '&[data-headlessui-state="selected"]': {
      color: vars.colors.neutrals.white,
    },
    '&[data-headlessui-state="selected"]::after': {
      content: "",
      position: "absolute",
      left: spacing(1),
      right: spacing(1),
      bottom: spacing(-1),
      height: 0,
      outline: "0",
      boxShadow: `0 0 0 1px ${vars.colors.neutrals.white}`, // renders as 2px thick
    },
  },
});
