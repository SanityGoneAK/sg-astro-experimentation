import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const container = style({
  backgroundColor: vars.colors.neutrals.darktone,
});

export const tabList = style({
  display: "flex",
  borderTopLeftRadius: spacing(0.8),
  overflow: "hidden",
  backgroundColor: vars.colors.neutrals.midtoneDarker,
});

export const tabIcon = style({
  width: spacing(8),
  height: spacing(8),
  objectFit: "cover",
  position: "relative",
  opacity: 0.33,
  display: "flex",
  background: vars.colors.neutrals.midtoneBrighter,
  justifyContent: "center",
  border: "none",
  margin: 0,
  padding: 0,
  overflow: "hidden",
  cursor: "pointer",

  ":focus-visible": {
    // outline: "1px solid black",
    outlineColor: vars.colors.accents.sky,
    outlineStyle: "solid",
  },

  selectors: {
    [`&[data-headlessui-state~=selected]`]: {
      opacity: 1,
    },
    [`&[data-headlessui-state~=selected]::after`]: {
      content: "``",
      position: "absolute",
      height: "2px",
      width: "100%",
      backgroundColor: vars.colors.neutrals.white,
      bottom: "0px",
    },
  },
});

export const tabIconImage = style({
  width: spacing(8),
  height: spacing(8),
  objectFit: "cover",
  position: "relative",
});

export const tabPanel = style({
  background:
    "linear-gradient(270deg, rgba(0, 0, 0, 0.33) 0%, rgba(0, 0, 0, 0.1) 12.34%, rgba(0, 0, 0, 0) 32.5%)",
  position: "relative",
});

export const tabPanelImage = style({
  width: "100%",
});

export const operatorInfo = style({
  display: "inline-flex",
  flexDirection: "column",
  gap: spacing(1),
  position: "absolute",
  left: spacing(3),
  bottom: spacing(3),
});

export const operatorInfoLabelContainer = style({
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(20, 20, 27, 0.8)",
  padding: spacing(0.5, 1),
  fontSize: vars.typography.body2.fontSize,
  lineHeight: vars.typography.body2.lineHeight,
  color: vars.colors.neutrals.white,
  display: "inline-flex",
  gap: spacing(1),
  width: "fit-content",
  borderRadius: spacing(0.5),
});

export const operatorInfoLabelTitle = style({
  color: vars.colors.neutrals.gray,
});

export const operatorInfoVoiceList = style({
  display: "flex",
  padding: "0px",
  margin: "0px",
  listStyle: "none",
  gap: spacing(1),
});

export const operatorInfoFlag = style({
  width: spacing(2.5),
  height: spacing(2.5),
  borderRadius: spacing(5),
});
