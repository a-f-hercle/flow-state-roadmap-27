
interface RoadmapItemOverlayProps {
  isDragging: boolean;
  isColliding: boolean;
  crossingTeamBoundary: string | null;
  projectTitle: string;
}

export function RoadmapItemOverlay({
  isDragging,
  isColliding,
  crossingTeamBoundary,
  projectTitle
}: RoadmapItemOverlayProps) {
  if (!isDragging && !isColliding) return null;
  
  return (
    <>
      {isDragging && (
        <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          {crossingTeamBoundary ? 
            `Moving to ${crossingTeamBoundary}` : 
            `Dragging ${projectTitle}`
          }
        </div>
      )}
      
      {isColliding && (
        <div className="absolute -bottom-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          Collision detected!
        </div>
      )}
    </>
  );
}
