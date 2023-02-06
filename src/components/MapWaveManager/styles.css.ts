import { style } from "@vanilla-extract/css";

import { spacing } from "../../theme-helpers";
import { vars } from "../../theme.css";

export const waveContainer = style({
  margin: spacing(2, 0),
});

export const table = style({
  borderCollapse: "collapse",
  borderRadius: spacing(1),
  overflow: "hidden",
  width: "100%",
  marginTop: spacing(2),
});

export const tableRow = style({
  background: vars.colors.neutrals.midtone,
  borderBottom: `1px solid ${vars.colors.neutrals.midtoneBrighter}`,
  borderCollapse: "collapse",
  ":hover": {
    background: vars.colors.neutrals.midtoneBrighter,
    cursor: "pointer",
  }
});

export const tableItem = style({
    padding: spacing(1, 2),
    textAlign: "center",
});

export const enemyTableItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: spacing(1, 2),
  textAlign: "center",
})

export const details = style({
  display: "flex",
  justifyContent: "space-between",
});

export const buttonContainer = style({
  display: "flex",
  gap: spacing(2),
});

export const actionButton = style({
  background: "transparent",
  border: `solid 1px ${vars.colors.neutrals.gray}`,
  padding: spacing(0.5, 1.5),
  color: vars.colors.neutrals.gray,
  borderRadius: spacing(12),
  height: spacing(5),
});
