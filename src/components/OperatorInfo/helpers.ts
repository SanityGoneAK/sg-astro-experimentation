import { toTitleCase } from "../../utils/strings";

export function getMeleeOrRangedOrBoth(
  position: string,
  description: string | null
) {
  return description?.toLowerCase().includes("can be deployed on ranged")
    ? "Melee or Ranged"
    : toTitleCase(position);
}
