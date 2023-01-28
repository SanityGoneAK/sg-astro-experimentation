import { itemImage } from "../../utils/images";
import itemsJson from "../../../data/items.json";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  unlockCond?: {
    phase: number;
    level: number;
  };
  itemCosts: OutputTypes.ItemCost[];
}

const shortNumberFormat = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const MaterialRequirements: React.FC<Props> = ({ itemCosts, unlockCond }) => {
  return (
    <div className={classes.root}>
      {/* TODO unlockCond stuff */}
      {/* TODO elite LMD costs */}
      {itemCosts.map(({ id, count }) => {
        const { name, rarity } = itemsJson[id as keyof typeof itemsJson];
        return (
          <div key={id} className={classes.itemStack}>
            <div
              className={
                classes.itemRarityBg[
                  rarity as keyof typeof classes.itemRarityBg
                ]
              }
            />
            <img className={classes.itemImage} src={itemImage(id)} alt={name} />
            <span className={classes.count}>
              <span className="visually-hidden">Count: {count}</span>
              <span aria-hidden="true">{shortNumberFormat.format(count)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default MaterialRequirements;
