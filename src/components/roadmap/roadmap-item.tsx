import { useState } from "react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "@/context/project-context";

interface RoadmapItemProps {
  project: Project;
  teamColor: string;
  statusStyle: string;
  leftPos: string;
  width: string;
  topPos: string;
  onMoveStart: () => void;
  onProjectClick: (projectId: string) => void;
}

export function RoadmapItem({
  project,
  teamColor,
  statusStyle,
  leftPos,
  width,
  topPos,
  onMoveStart,
  onProjectClick,
}: RoadmapItemProps) {
  const { updateProject } = useProjects();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ left: leftPos, top: topPos });

  // Format date in shortened format
  const formatShortDate = (date: Date) => {
    return format(date, "MMM d");
  };

  // Get status label
  const getStatusLabel = (status: string | undefined) => {
    if (!status) return '';
    
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'planned': return 'Planned';
      case 'blocked': return 'Blocked';
      default: return status;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only activate dragging with right mouse button (button 2)
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      onMoveStart();
      
      // Calculate offset from mouse position to element corner
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const parentRect = document.querySelector('.roadmap-timeline')?.getBoundingClientRect();
    if (!parentRect) return;

    // Calculate new position relative to parent
    const newLeft = e.clientX - parentRect.left - dragOffset.x;
    const newTop = e.clientY - parentRect.top - dragOffset.y;
    
    // Snap to a timeline grid (monthly)
    const monthWidth = parentRect.width / 12;
    const snapToMonth = Math.round(newLeft / monthWidth) * monthWidth;
    const leftPercent = (snapToMonth / parentRect.width) * 100 + '%';
    
    // Keep the item within the timeline
    const boundedTop = Math.max(0, Math.min(newTop, parentRect.height - 40));
    const topPx = boundedTop + 'px';
    
    setPosition({
      left: leftPercent,
      top: topPx
    });
    
    // Calculate new dates based on position
    const monthIndex = Math.floor((snapToMonth / parentRect.width) * 12);
    const newStartDate = new Date(2025, monthIndex, 1);
    const newEndDate = new Date(project.endDate!);
    
    // Maintain the same duration
    const duration = project.endDate!.getTime() - project.startDate!.getTime();
    newEndDate.setTime(newStartDate.getTime() + duration);
    
    // Update internal state (will be saved on mouse up)
    project.startDate = newStartDate;
    project.endDate = newEndDate;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Save the updated project with new dates
      updateProject(project);
    }
  };

  const handleClick = () => {
    if (!isDragging) {
      onProjectClick(project.id);
    }
  };

  return (
    <div
      className={`absolute ${teamColor} ${statusStyle} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${isDragging ? 'opacity-75 z-50' : ''}`}
      style={{ 
        left: isDragging ? position.left : leftPos, 
        width: width,
        top: isDragging ? position.top : topPos
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right click
    >
      <div className="text-sm font-medium truncate">{project.title}</div>
      <div className="flex items-center justify-between mt-1 text-xs">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span>
            {formatShortDate(project.startDate!)} - {formatShortDate(project.endDate!)}
          </span>
        </div>
        <Badge 
          className={`text-[10px] h-4 py-0 ${
            project.status === 'completed' ? 'bg-green-500' : 
            project.status === 'in-progress' ? 'bg-blue-500' : 
            project.status === 'blocked' ? 'bg-red-500' : 'bg-amber-500'
          }`}
        >
          {getStatusLabel(project.status)}
        </Badge>
      </div>
    </div>
  );
}
