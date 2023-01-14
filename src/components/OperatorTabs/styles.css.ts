import { style } from "@vanilla-extract/css";

export const tabList = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, auto) 1fr",
});

export const tabListButton = style({
  selectors: {
    "&:last-child": {
      justifySelf: "end",
    },
  },
});
