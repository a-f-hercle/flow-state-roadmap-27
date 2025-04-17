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
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ left: leftPos, top: topPos });
  const [itemWidth, setItemWidth] = useState(width);
  const itemRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const initialDateRef = useRef({ startDate: project.startDate, endDate: project.endDate });
  const mouseDownTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isResizingRef = useRef<boolean>(false);

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
    
    // Store when the mouse was pressed down
    mouseDownTimeRef.current = Date.now();
    
    // Only initiate drag with right mouse button or when Ctrl/Cmd is pressed
    if (e.button === 2 || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      isDraggingRef.current = true;
      onMoveStart();
      
      // Calculate position of mouse relative to parent element
      if (timelineRef.current && itemRef.current) {
        const parentRect = timelineRef.current.getBoundingClientRect();
        const itemRect = itemRef.current.getBoundingClientRect();
        
        setDragStartPos({
          x: e.clientX - (itemRect.left - parentRect.left),
          y: e.clientY - (itemRect.top - parentRect.top)
        });
      }
      
      // Store initial dates for reference
      initialDateRef.current = {
        startDate: new Date(project.startDate!),
        endDate: new Date(project.endDate!)
      };
      
      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    isResizingRef.current = true;
    onMoveStart();
    
    // Store mouse down time
    mouseDownTimeRef.current = Date.now();
    
    // Store initial width and position
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setDragStartPos({ x: e.clientX, y: e.clientY });
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
    if (!isDraggingRef.current || !timelineRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    
    // Calculate new position relative to parent
    const newLeft = e.clientX - parentRect.left - dragStartPos.x;
    const newTop = e.clientY - parentRect.top - dragStartPos.y;
    
    // Snap to a timeline grid (monthly)
    const monthWidth = parentRect.width / 12;
    const snapToMonth = Math.round(newLeft / monthWidth) * monthWidth;
    const leftPercent = (snapToMonth / parentRect.width) * 100 + '%';
    
    // Keep the item within the timeline and respect row boundaries
    // Round to nearest multiple of 45px for row height
    const rowHeight = 45;
    const snapToRow = Math.round(newTop / rowHeight) * rowHeight + 8;
    const topPx = Math.max(8, snapToRow) + 'px';
    
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
    if (!isResizingRef.current || !timelineRef.current || !itemRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    const itemRect = itemRef.current.getBoundingClientRect();
    
    // Calculate the new width based on mouse position
    const newWidth = Math.max(50, e.clientX - itemRect.left); // Minimum 50px width
    
    // Snap width to month grid
    const monthWidth = parentRect.width / 12;
    const months = Math.max(1, Math.round(newWidth / monthWidth));
    const snappedWidth = months * monthWidth;
    const snappedWidthPercent = (snappedWidth / parentRect.width) * 100;
    
    // Update width state
    setItemWidth(`${Math.max(4, snappedWidthPercent)}%`); // Minimum 4% width
    
    // Calculate the new end date based on width
    const newEndDate = new Date(project.startDate!);
    newEndDate.setMonth(newEndDate.getMonth() + months);
    
    // Update internal state (will be saved on mouse up)
    project.endDate = newEndDate;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Save the updated project with new dates
      updateProject(project);
    }
  };

  const handleResizeEnd = () => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      
      // Save the updated project with new end date
      updateProject(project);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Check if the click started as a drag/resize operation
    if (isDraggingRef.current || isResizingRef.current) {
      return;
    }
    
    // Check if it's not a drag attempt (clicked and released quickly)
    const clickDuration = Date.now() - mouseDownTimeRef.current;
    if (clickDuration < 200) {
      // If click is on resize handle, don't navigate
      if ((e.target as HTMLElement).closest('.resize-handle')) {
        return;
      }
      
      onProjectClick(project.id);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`absolute ${teamColor} ${statusStyle} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${isDragging || isResizing ? 'opacity-75 z-50' : ''}`}
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
      
      {/* Resize handle - made more visible */}
      <div 
        className="resize-handle absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize hover:bg-black/10 dark:hover:bg-white/10 rounded-r-md"
        onMouseDown={handleResizeStart}
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
