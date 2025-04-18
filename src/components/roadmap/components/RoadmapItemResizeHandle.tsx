
import { GripHorizontal } from "lucide-react";

interface RoadmapItemResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
}

export function RoadmapItemResizeHandle({
  onResizeStart
}: RoadmapItemResizeHandleProps) {
  return (
    <div 
      className="resize-handle absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize hover:bg-black/10 dark:hover:bg-white/10 rounded-r-md"
      onMouseDown={onResizeStart}
    >
      <GripHorizontal className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
