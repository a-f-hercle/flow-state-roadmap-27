
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, GripHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "@/context/project-context";
import { toast } from "sonner";
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
  onDragMove?: (rowIndex: number) => void;
  teamBoundaries: { name: string, top: number, bottom: number }[];
  isLastRow: boolean;
  onCollision?: (isColliding: boolean) => void;
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
  onDragMove,
  teamBoundaries,
  isLastRow,
  onCollision
}: RoadmapItemProps) {
  const { updateProject } = useProjects();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ left: leftPos, top: topPos });
  const [itemWidth, setItemWidth] = useState(width);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const [crossingTeamBoundary, setCrossingTeamBoundary] = useState<string | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const initialDateRef = useRef({ startDate: project.startDate, endDate: project.endDate });
  const mouseDownTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isResizingRef = useRef<boolean>(false);
  const currentRowRef = useRef<number>(0);
  const currentTeamRef = useRef<string>(project.team);
  const TEAM_LABEL_WIDTH = 160;

  useEffect(() => {
    if (topPos) {
      const match = topPos.match(/(\d+)px/);
      if (match && match[1]) {
        const pixelValue = parseInt(match[1], 10);
        const rowHeight = 45;
        const rowIndex = Math.floor((pixelValue - 8) / rowHeight);
        currentRowRef.current = rowIndex;
      }
    }
  }, [topPos]);

  const formatShortDate = (date: Date) => {
    return format(date, "MMM d");
  };

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

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(project.status || 'planned');
    updateProject({
      ...project,
      status: nextStatus
    });
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = ['planned', 'in-progress', 'completed', 'blocked'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[(currentIndex + 1) % statusFlow.length] as typeof project.status;
  };

  const getStatusColor = (status: string | undefined) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  useEffect(() => {
    if (itemRef.current) {
      const parent = itemRef.current.closest('.roadmap-timeline');
      if (parent instanceof HTMLDivElement) {
        timelineRef.current = parent;
      }
    }
  }, []);

  useEffect(() => {
    if (!isDragging) {
      setPosition({ left: leftPos, top: topPos });
    }
    if (!isResizing) {
      setItemWidth(width);
    }
  }, [leftPos, topPos, width, isDragging, isResizing]);

  // Check if this item collides with any other project items
  const checkCollision = () => {
    if (!itemRef.current || !timelineRef.current) return false;
    
    const thisRect = itemRef.current.getBoundingClientRect();
    const thisTop = thisRect.top;
    const thisBottom = thisRect.bottom;
    const thisLeft = thisRect.left;
    const thisRight = thisRect.right;
    
    // Get all roadmap items except this one
    const allItems = timelineRef.current.querySelectorAll('.roadmap-item');
    
    let collides = false;
    
    allItems.forEach(item => {
      if (item === itemRef.current) return; // Skip self
      
      const otherRect = item.getBoundingClientRect();
      
      // Check if items overlap horizontally and vertically
      if (
        thisLeft < otherRect.right && 
        thisRight > otherRect.left &&
        thisTop < otherRect.bottom && 
        thisBottom > otherRect.top
      ) {
        collides = true;
      }
    });
    
    setIsColliding(collides);
    if (onCollision) onCollision(collides);
    
    return collides;
  };

  // Check which team's area the item is currently in
  const checkTeamBoundary = (clientY: number) => {
    if (!teamBoundaries.length) return null;
    
    for (const boundary of teamBoundaries) {
      if (clientY >= boundary.top && clientY <= boundary.bottom) {
        return boundary.name;
      }
    }
    
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
    mouseDownTimeRef.current = Date.now();
    
    if (e.button === 2 || e.altKey || e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      isDraggingRef.current = true;
      onMoveStart();
      
      if (timelineRef.current && itemRef.current) {
        const parentRect = timelineRef.current.getBoundingClientRect();
        const itemRect = itemRef.current.getBoundingClientRect();
        
        setDragStartPos({
          x: e.clientX - (itemRect.left - parentRect.left),
          y: e.clientY - (itemRect.top - parentRect.top)
        });
      }
      
      initialDateRef.current = {
        startDate: new Date(project.startDate!),
        endDate: new Date(project.endDate!)
      };
      
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
    
    mouseDownTimeRef.current = Date.now();
    
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
    
    initialDateRef.current = {
      startDate: new Date(project.startDate!),
      endDate: new Date(project.endDate!)
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !timelineRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    
    const timelineStart = TEAM_LABEL_WIDTH;
    const mouseXRelativeToTimeline = e.clientX - parentRect.left - timelineStart;
    
    const adjustedLeft = Math.max(0, mouseXRelativeToTimeline);
    
    const newTop = e.clientY - parentRect.top - dragStartPos.y;
    
    const weekWidth = (parentRect.width - timelineStart) / 52;
    const snapToWeek = Math.round(adjustedLeft / weekWidth) * weekWidth;
    const leftPercent = (snapToWeek / (parentRect.width - timelineStart)) * 100 + '%';
    
    const rowHeight = 45;
    const snapToRow = Math.max(0, Math.round(newTop / rowHeight)) * rowHeight + 8;
    const topPx = Math.max(8, snapToRow) + 'px';
    
    const rowIndex = Math.floor(snapToRow / rowHeight);
    
    if (onDragMove && currentRowRef.current !== rowIndex) {
      currentRowRef.current = rowIndex;
      onDragMove(rowIndex);
    }
    
    // Check which team's section the item is being dragged into
    const newTeam = checkTeamBoundary(e.clientY);
    if (newTeam && newTeam !== currentTeamRef.current) {
      setCrossingTeamBoundary(newTeam);
    } else {
      setCrossingTeamBoundary(null);
    }
    
    setPosition({
      left: leftPercent,
      top: topPx
    });
    
    const startDate = new Date(2025, 0, 1);
    const weekIndex = Math.floor((snapToWeek / (parentRect.width - timelineStart)) * 52);
    
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newStartDate = new Date(startDate.getTime() + (weekIndex * msInWeek));
    
    const duration = initialDateRef.current.endDate!.getTime() - initialDateRef.current.startDate!.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);
    
    project.startDate = newStartDate;
    project.endDate = newEndDate;
    
    // Check for collisions
    setTimeout(() => {
      checkCollision();
    }, 0);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizingRef.current || !timelineRef.current || !itemRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    const itemRect = itemRef.current.getBoundingClientRect();
    
    const newWidth = Math.max(50, e.clientX - itemRect.left);
    
    const weekWidth = (parentRect.width - TEAM_LABEL_WIDTH) / 52;
    const weeks = Math.max(1, Math.round(newWidth / weekWidth));
    const snappedWidth = weeks * weekWidth;
    const snappedWidthPercent = (snappedWidth / (parentRect.width - TEAM_LABEL_WIDTH)) * 100;
    
    setItemWidth(`${Math.max(2, snappedWidthPercent)}%`);
    
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(project.startDate!.getTime() + (weeks * msInWeek));
    
    project.endDate = newEndDate;
    
    // Check for collisions after resize
    setTimeout(() => {
      checkCollision();
    }, 0);
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      const clickDuration = Date.now() - mouseDownTimeRef.current;
      isDraggingRef.current = false;
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Check if we crossed into a different team's section
      if (crossingTeamBoundary && crossingTeamBoundary !== project.team) {
        const updatedProject = {
          ...project,
          team: crossingTeamBoundary,
        };
        updateProject(updatedProject);
        toast.success(`Project moved to ${crossingTeamBoundary} team`);
        currentTeamRef.current = crossingTeamBoundary;
      } else {
        updateProject(project);
      }
      
      setCrossingTeamBoundary(null);
      setIsColliding(false);
    }
  };

  const handleResizeEnd = () => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      
      updateProject(project);
      setIsColliding(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    
    const clickDuration = Date.now() - mouseDownTimeRef.current;
    
    if (clickDuration < 200 && !isDraggingRef.current && !isResizingRef.current) {
      onProjectClick(project.id);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && document.activeElement === itemRef.current) {
      e.preventDefault();
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = () => {
    updateProject({
      ...project,
      isDeleted: true
    });
    setShowDeleteDialog(false);
  };

  // Get border style based on collision state
  const getBorderStyle = () => {
    if (isColliding) {
      return "border-2 border-red-500";
    }
    if (crossingTeamBoundary) {
      return "border-2 border-purple-500";
    }
    return "border";
  };

  return (
    <>
      <div
        ref={itemRef}
        className={`absolute ${teamColor} ${statusStyle} ${getBorderStyle()} rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow ${isDragging || isResizing ? 'opacity-75 z-50' : ''} roadmap-item`}
        style={{ 
          left: isDragging ? position.left : leftPos, 
          width: isResizing ? itemWidth : width,
          top: isDragging ? position.top : topPos,
          minHeight: "44px" // Ensure minimum height for content
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="p-2 flex flex-col gap-1">
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
              onClick={handleStatusToggle}
              className={`${getStatusColor(project.status)} text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity ml-auto`}
            >
              {getStatusLabel(project.status)}
            </button>
          </div>
        </div>
        
        <div 
          className="resize-handle absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize hover:bg-black/10 dark:hover:bg-white/10 rounded-r-md"
          onMouseDown={handleResizeStart}
        >
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {isDragging && (
          <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            {crossingTeamBoundary && crossingTeamBoundary !== project.team ? 
              `Moving to ${crossingTeamBoundary}` : 
              `Dragging ${project.title}`
            }
          </div>
        )}
        
        {isColliding && (
          <div className="absolute -bottom-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            Collision detected!
          </div>
        )}
      </div>

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
