
import { KeyboardEvent } from "react";
import { Project } from "@/types";
import { Clock } from "lucide-react";
import { formatShortDate } from "@/utils/dateUtils";
import { getStatusColor, getStatusLabel } from "../utils/taskStatusUtils";

interface RoadmapItemDetailProps {
  project: Project;
  onStatusToggle: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

export function RoadmapItemDetail({ 
  project, 
  onStatusToggle,
  onDelete
}: RoadmapItemDetailProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && document.activeElement === e.currentTarget) {
      e.preventDefault();
      onDelete();
    }
  };

  return (
    <div 
      className="p-2 flex flex-col gap-1"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="font-medium text-sm leading-tight w-full mb-1 pr-6">
        {project.title}
      </div>
      
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {formatShortDate(project.startDate!)} - {formatShortDate(project.endDate!)}
          </span>
        </div>
        
        <button
          onClick={onStatusToggle}
          className={`${getStatusColor(project.status)} text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity ml-auto`}
        >
          {getStatusLabel(project.status)}
        </button>
      </div>
    </div>
  );
}
