
import { useState, useRef, useEffect } from "react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, GripHorizontal } from "lucide-react";
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
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ left: leftPos, top: topPos });
  const [itemWidth, setItemWidth] = useState(width);
  const itemRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const initialDateRef = useRef({ startDate: project.startDate, endDate: project.endDate });
  const initialWidthRef = useRef(0);

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

  // Find the parent timeline element
  useEffect(() => {
    if (itemRef.current) {
      const parent = itemRef.current.closest('.roadmap-timeline');
      if (parent instanceof HTMLDivElement) {
        timelineRef.current = parent;
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't activate dragging when clicking on the resize handle
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
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
    
    // Store initial dates for reference
    initialDateRef.current = {
      startDate: new Date(project.startDate!),
      endDate: new Date(project.endDate!)
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onMoveStart();
    
    // Store initial width and position
    if (itemRef.current) {
      initialWidthRef.current = itemRef.current.getBoundingClientRect().width;
    }
    
    // Store initial dates for reference
    initialDateRef.current = {
      startDate: new Date(project.startDate!),
      endDate: new Date(project.endDate!)
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    
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
    
    // Maintain the same duration
    const duration = initialDateRef.current.endDate!.getTime() - initialDateRef.current.startDate!.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);
    
    // Update internal state (will be saved on mouse up)
    project.startDate = newStartDate;
    project.endDate = newEndDate;
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !timelineRef.current || !itemRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    const itemRect = itemRef.current.getBoundingClientRect();
    
    // Calculate the new width based on mouse position
    const newWidth = Math.max(50, e.clientX - itemRect.left); // Minimum 50px width
    
    // Calculate the width percentage relative to the parent
    const widthPercent = (newWidth / parentRect.width) * 100;
    
    // Snap width to month grid
    const monthWidth = parentRect.width / 12;
    const months = Math.round(newWidth / monthWidth);
    const snappedWidthPercent = (months * monthWidth / parentRect.width) * 100;
    
    // Update width state
    setItemWidth(`${Math.max(4, snappedWidthPercent)}%`); // Minimum 4% width
    
    // Calculate the new end date based on width
    const startTimestamp = project.startDate!.getTime();
    const monthsFromStart = months;
    
    // Create a new date that is 'monthsFromStart' months ahead of the start date
    const newEndDate = new Date(project.startDate!);
    newEndDate.setMonth(newEndDate.getMonth() + monthsFromStart);
    
    // Update internal state (will be saved on mouse up)
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

  const handleResizeEnd = () => {
    if (isResizing) {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      
      // Save the updated project with new end date
      updateProject(project);
    }
  };

  const handleClick = () => {
    if (!isDragging && !isResizing) {
      onProjectClick(project.id);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`absolute ${teamColor} ${statusStyle} border rounded-md p-2 shadow-sm cursor-move hover:shadow-md transition-shadow ${isDragging || isResizing ? 'opacity-75 z-50' : ''}`}
      style={{ 
        left: isDragging ? position.left : leftPos, 
        width: isResizing ? itemWidth : width,
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
      
      {/* Resize handle */}
      <div 
        className="resize-handle absolute right-0 top-0 bottom-0 w-4 flex items-center justify-center cursor-ew-resize"
        onMouseDown={handleResizeStart}
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground opacity-50 hover:opacity-100" />
      </div>
    </div>
  );
}
