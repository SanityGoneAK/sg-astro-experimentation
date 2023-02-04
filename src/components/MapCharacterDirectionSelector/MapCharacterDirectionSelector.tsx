import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  restrictToParentElement,
  snapCenterToCursor,
} from "@dnd-kit/modifiers";

import * as classes from "./styles.css";

interface Props {
  setDirection?: (newValue: string) => void;
}

const MapCharacterDirectionSelector: React.FC<Props> = ({ setDirection }) => {
  function setDirectionTo(event: DragEndEvent) {
    if (event.over && event.over.id && setDirection) {
      setDirection(event.over.id as string);
    }
  }

  return (
    <DndContext
      onDragEnd={setDirectionTo}
      modifiers={[snapCenterToCursor, restrictToParentElement]}
    >
      <div className={classes.directionHandleWrapper}>
        <MapCharacterDirectionHandle></MapCharacterDirectionHandle>
      </div>

      <div className={classes.directionSelector}>
        <MapCharacterDirectionZone direction="north" />
        <MapCharacterDirectionZone direction="east" />
        <MapCharacterDirectionZone direction="west" />
        <MapCharacterDirectionZone direction="south" />
      </div>
    </DndContext>
  );
};
export default MapCharacterDirectionSelector;

interface PropsCharacterHandle {}

const MapCharacterDirectionHandle: React.FC<PropsCharacterHandle> = () => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "character-handle",
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={classes.directionHandle}
    ></div>
  );
};

interface PropsCharacterZone {
  direction: string;
}

const MapCharacterDirectionZone: React.FC<PropsCharacterZone> = ({
  direction,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${direction}`,
  });

  return <div ref={setNodeRef} className={classes.directionZone}></div>;
};
