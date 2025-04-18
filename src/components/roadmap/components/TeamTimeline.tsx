
import { useRef } from "react";
import { Project } from "@/types";
import { RoadmapItem } from "../roadmap-item";
import { format } from "date-fns";

interface TeamTimelineProps {
  team: string;
  containerHeight: string;
  rows: {
    project: Project;
    row: number;
    leftPos: string;
    width: string;
    isLastRow: boolean;
  }[];
  teamBoundaries: { name: string, top: number, bottom: number }[];
  onMoveStart: () => void;
  onProjectClick: (projectId: string) => void;
  onDragMove: (rowIndex: number) => void;
  isExpanding: boolean;
  teamColors: Record<string, string>;
  statusStyles: Record<string, string>;
  onCollisionChange: (isColliding: boolean) => void;
}

export function TeamTimeline({
  team,
  containerHeight,
  rows,
  teamBoundaries,
  onMoveStart,
  onProjectClick,
  onDragMove,
  isExpanding,
  teamColors,
  statusStyles,
  onCollisionChange
}: TeamTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      className={`flex-1 relative roadmap-timeline ${
        isExpanding ? 'bg-purple-50 dark:bg-purple-900/10' : ''
      }`} 
      style={{ height: containerHeight }}
      ref={timelineRef}
    >
      <div className="grid grid-cols-12 h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r last:border-r-0 h-full">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex-1 h-full border-r last:border-r-0 border-dashed border-gray-100 dark:border-gray-800" />
            ))}
          </div>
        ))}
      </div>
      
      {/* Expansion indicator at the bottom */}
      {isExpanding && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-purple-500 z-20 animate-pulse" />
      )}
      
      <div className="absolute inset-0 pt-2 pb-8">
        {rows.map(({ project, row, leftPos, width, isLastRow }) => {
          const topPos = `${row * 45 + 8}px`;
          const projectStatus = project.status || 'planned';
          
          return (
            <RoadmapItem
              key={project.id}
              project={project}
              teamColor={teamColors[project.team] || teamColors["Tech Trading"]}
              statusStyle={statusStyles[projectStatus] || statusStyles["planned"]}
              leftPos={leftPos}
              width={width}
              topPos={topPos}
              onMoveStart={onMoveStart}
              onProjectClick={onProjectClick}
              onDragMove={(rowIndex) => onDragMove(rowIndex)}
              teamBoundaries={teamBoundaries}
              isLastRow={isLastRow}
              onCollision={onCollisionChange}
            />
          );
        })}
      </div>
    </div>
  );
}
