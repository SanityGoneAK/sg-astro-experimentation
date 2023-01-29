import * as classes from "./styles.css";

interface Props {}
const MapTile: React.FC<Props> = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <rect
          id="start"
          width="60"
          height="60"
          stroke="#F45C5C"
          stroke-width="4"
        />
        <rect
          id="end"
          width="60"
          height="60"
          stroke="#49B3FF"
          stroke-width="4"
        />
      </defs>
    </svg>
  );
};
export default MapTile;
