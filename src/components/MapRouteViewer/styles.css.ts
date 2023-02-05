import { style } from "@vanilla-extract/css";
import { spacing } from "../../theme-helpers";

export const container = style({
    marginTop: spacing(4),
    top:" 0",
    position: "absolute",
    zIndex: "1000",
})
export const root = style({

    transform: "scaleY(-1)",
});
