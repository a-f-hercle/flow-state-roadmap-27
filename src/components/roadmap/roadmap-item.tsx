
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, GripHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "@/context/project-context";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  // Update position and width when props change
  useEffect(() => {
    if (!isDragging) {
      setPosition({ left: leftPos, top: topPos });
    }
    if (!isResizing) {
      setItemWidth(width);
    }
  }, [leftPos, topPos, width, isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't activate dragging when clicking on the resize handle
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
    // Store when the mouse was pressed down
    mouseDownTimeRef.current = Date.now();
    
    // Initiate drag with right mouse button, Alt key, or when holding the middle mouse button
    if (e.button === 2 || e.altKey || e.button === 1) {
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
    
    // Snap to a timeline grid (weekly instead of monthly)
    const weekWidth = parentRect.width / 52; // 52 weeks in a year
    const snapToWeek = Math.round(newLeft / weekWidth) * weekWidth;
    const leftPercent = (snapToWeek / parentRect.width) * 100 + '%';
    
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
    const startDate = new Date(2025, 0, 1); // Jan 1, 2025
    const weekIndex = Math.floor((snapToWeek / parentRect.width) * 52);
    
    // Calculate the new start date based on the week index
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newStartDate = new Date(startDate.getTime() + (weekIndex * msInWeek));
    
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
    
    // Snap width to week grid (instead of month grid)
    const weekWidth = parentRect.width / 52; // 52 weeks in a year
    const weeks = Math.max(1, Math.round(newWidth / weekWidth));
    const snappedWidth = weeks * weekWidth;
    const snappedWidthPercent = (snappedWidth / parentRect.width) * 100;
    
    // Update width state
    setItemWidth(`${Math.max(2, snappedWidthPercent)}%`); // Minimum 2% width
    
    // Calculate the new end date based on weeks
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(project.startDate!.getTime() + (weeks * msInWeek));
    
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
    // Prevent navigation when clicking on resize handle or during drag operations
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    
    // Check if it's not a drag attempt (clicked and released quickly)
    const clickDuration = Date.now() - mouseDownTimeRef.current;
    
    // Navigation only happens for short clicks and when not dragging/resizing
    if (clickDuration < 200 && !isDraggingRef.current && !isResizingRef.current) {
      onProjectClick(project.id);
    }
  };

  // Handle key press for deletion (Del key)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && document.activeElement === itemRef.current) {
      e.preventDefault();
      setShowDeleteDialog(true);
    }
  };

  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    const { updateProject } = useProjects();
    updateProject({
      ...project,
      isDeleted: true
    });
    setShowDeleteDialog(false);
  };

  return (
    <>
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
        onKeyDown={handleKeyDown}
        tabIndex={0} // Make the element focusable for keyboard events
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium truncate">{project.title}</div>
          <Badge 
            className={`text-[10px] h-4 py-0 ml-1 ${
              project.status === 'completed' ? 'bg-green-500' : 
              project.status === 'in-progress' ? 'bg-blue-500' : 
              project.status === 'blocked' ? 'bg-red-500' : 'bg-amber-500'
            }`}
          >
            {getStatusLabel(project.status)}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {formatShortDate(project.startDate!)} - {formatShortDate(project.endDate!)}
          </span>
        </div>
        
        {/* Resize handle */}
        <div 
          className="resize-handle absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize hover:bg-black/10 dark:hover:bg-white/10 rounded-r-md"
          onMouseDown={handleResizeStart}
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Drag helper tooltip */}
        {isDragging && (
          <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded">
            Dragging...
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the project "{project.title}" to the trash. You can restore it later from the trash bin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
