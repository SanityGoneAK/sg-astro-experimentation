import * as classes from "./styles.css";
import { DndContext } from "@dnd-kit/core";

interface Props {}

const MapViewer: React.FC<Props> = () => {
  const getSvgDefs = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <rect
          id="tile_start"
          width="60"
          height="60"
          stroke="#F45C5C"
          stroke-width="4"
        />
        <g id="tile_start_drone">
          <rect
            x="2"
            y="2.00002"
            width="60"
            height="60"
            stroke="#F45C5C"
            stroke-width="4"
          />
          <circle
            cx="23.5"
            cy="23.5"
            r="5.5"
            stroke="#F45C5C"
            stroke-width="4"
          />
          <circle
            cx="40.5"
            cy="23.5"
            r="5.5"
            stroke="#F45C5C"
            stroke-width="4"
          />
          <circle
            cx="23.5"
            cy="40.5"
            r="5.5"
            stroke="#F45C5C"
            stroke-width="4"
          />
          <circle
            cx="40.5"
            cy="40.5"
            r="5.5"
            stroke="#F45C5C"
            stroke-width="4"
          />
          <rect
            x="28.3685"
            y="25.5401"
            width="14.7833"
            height="4"
            transform="rotate(45 28.3685 25.5401)"
            fill="#F45C5C"
          />
          <rect
            x="38.4546"
            y="28.6875"
            width="15.227"
            height="4"
            transform="rotate(135 38.4546 28.6875)"
            fill="#F45C5C"
          />
          <rect
            x="36"
            y="28"
            width="8"
            height="8"
            transform="rotate(90 36 28)"
            fill="#F45C5C"
          />
        </g>
        <rect
          id="tile_end"
          width="60"
          height="60"
          stroke="#49B3FF"
          stroke-width="4"
        />
        <rect
          id="tile_floor"
          width="60"
          height="60"
          fill="#191920"
          stroke="#24242E"
          stroke-width="4"
        />
        <rect
          id="tile_forbidden"
          width="60"
          height="60"
          fill="#101014"
          stroke="#24242E"
          stroke-width="4"
        />
        <rect
          id="tile_road"
          width="60"
          height="60"
          fill="#363643"
          stroke="#484858"
          stroke-width="4"
        />
        <rect
          id="tile_road"
          width="60"
          height="60"
          fill="#363643"
          stroke="#484858"
          stroke-width="4"
        />
        <rect
          id="tile_wall"
          width="60"
          height="60"
          fill="#87879B"
          stroke="#484858"
          stroke-width="4"
        />
      </defs>
    </svg>
  );

  return <DndContext>{getSvgDefs}</DndContext>;
};
export default MapViewer;
