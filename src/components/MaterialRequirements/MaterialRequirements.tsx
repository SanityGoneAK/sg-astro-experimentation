import { itemImage } from "../../utils/images";
import itemsJson from "../../../data/items.json";
import { EliteOneIcon, EliteTwoIcon, EliteZeroIcon } from "../icons";

import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";

interface Props {
  minElite?: number;
  minLevel?: number;
  minSkillLevel?: number;
  itemCosts: OutputTypes.ItemCost[];
}

const shortNumberFormat = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const MaterialRequirements: React.FC<Props> = ({
  itemCosts,
  minElite,
  minLevel = 1,
  minSkillLevel = 1,
}) => {
  return (
    <div className={classes.root}>
      {minElite != null && (
        <div className={classes.minEliteMinLevel}>
          {minElite === 0 && <EliteZeroIcon active />}
          {minElite === 1 && <EliteOneIcon active />}
          {minElite === 2 && <EliteTwoIcon active />}
          <span className={classes.minLevel}>Lv{minLevel}</span>
        </div>
      )}
      {minSkillLevel > 1 &&
        // TODO
        null}
      <div className={classes.items}>
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
              <img
                className={classes.itemImage}
                src={itemImage(id)}
                alt={name}
              />
              <span className={classes.count}>
                <span className="visually-hidden">Count: {count}</span>
                <span aria-hidden="true">
                  {shortNumberFormat.format(count)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MaterialRequirements;
