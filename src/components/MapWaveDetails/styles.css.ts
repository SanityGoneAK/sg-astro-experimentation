import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const details = style({
  display: "flex",
  justifyContent: "space-between",
  gap: spacing(2),
  width: "100%",
  background: vars.colors.neutrals.midtone,
  padding: spacing(1),
  margin: spacing(1, 0),
  borderRadius: spacing(1),
  minHeight: spacing(9),
  alignItems: "center",
});

export const buttonContainer = style({
  display: "flex",
  gap: spacing(2),
  marginLeft: "auto",
});

export const actionButton = style({
  background: "transparent",
  border: `solid 1px ${vars.colors.neutrals.gray}`,
  padding: spacing(0.5, 1.5),
  color: vars.colors.neutrals.gray,
  borderRadius: spacing(12),
  height: spacing(5),
});

export const actionDetails = style({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
});

export const actionDetailsList = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  listStyle: "none",
  padding: 0,
});

export const actionListItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
});
