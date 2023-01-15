import { rawColors } from "../theme.css";

const SvgRarityGradientDefs: React.FC = () => {
  return (
    <svg>
      <defs>
        <linearGradient id="rarity6">
          <stop offset="0%" stopColor={rawColors.accents.orangeLight}></stop>
          <stop offset="100%" stopColor={rawColors.accents.orange}></stop>
        </linearGradient>
        <linearGradient id="rarity5">
          <stop offset="0%" stopColor={rawColors.accents.yellowLight}></stop>
          <stop offset="100%" stopColor={rawColors.accents.yellow}></stop>
        </linearGradient>
        <linearGradient id="rarity4">
          <stop offset="0%" stopColor={rawColors.accents.purpleLight}></stop>
          <stop offset="100%" stopColor={rawColors.accents.purple}></stop>
        </linearGradient>
        <linearGradient id="rarity3">
          <stop offset="0%" stopColor={rawColors.accents.skyLight}></stop>
          <stop offset="100%" stopColor={rawColors.accents.sky}></stop>
        </linearGradient>
        <linearGradient id="rarity2">
          <stop offset="0%" stopColor={rawColors.accents.greenLight}></stop>
          <stop offset="100%" stopColor={rawColors.accents.green}></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
export default SvgRarityGradientDefs;
