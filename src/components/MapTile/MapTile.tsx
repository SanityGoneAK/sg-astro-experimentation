import { useDroppable } from "@dnd-kit/core";
import * as classes from "./styles.css";

type Props = React.PropsWithChildren<{
  tileType: string;
  rowIndex: number;
  tileIndex: number;
  validDropLocation: boolean;
}>;

const MapTile: React.FC<Props> = ({
  tileType,
  rowIndex,
  tileIndex,
  validDropLocation,
  children,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${tileIndex}`,
  });
  const coordinate = String.fromCharCode(65 + rowIndex) + "" + tileIndex;

  return (
    <div
      ref={setNodeRef}
      className={validDropLocation ? classes.tile.drop : classes.tile.default}
    >
      <p className={classes.coordinate}>{coordinate}</p>
      {children && <div className={classes.character}>{children}</div>}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use xlinkHref={`#${tileType}`} />
      </svg>
    </div>
  );
};
export default MapTile;
