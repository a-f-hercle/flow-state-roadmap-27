
import { useState, useRef, useEffect } from "react";
import { Project } from "@/types";
import { useProjects } from "@/context/project-context";
import { toast } from "sonner";
import { useRoadmapDrag } from "./hooks/useRoadmapDrag";
import { useRoadmapResize } from "./hooks/useRoadmapResize";
import { getStatusStyle, getNextStatus } from "./utils/taskStatusUtils";
import { RoadmapItemDetail } from "./components/RoadmapItemDetail";
import { RoadmapItemResizeHandle } from "./components/RoadmapItemResizeHandle";
import { RoadmapItemOverlay } from "./components/RoadmapItemOverlay";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const mouseDownTimeRef = useRef<number>(0);
  
  // Setup drag functionality
  const {
    dragState,
    itemRef: dragRef,
    handleMouseDown,
    handleMouseUp,
    checkCollision: checkDragCollision
  } = useRoadmapDrag({
    onMoveStart,
    onDragMove: onDragMove ? (rowIndex) => onDragMove(rowIndex) : undefined,
    timelineRef,
    initialLeftPos: leftPos,
    initialTopPos: topPos,
    teamBoundaries,
    project,
    onCollision
  });
  
  // Setup resize functionality
  const {
    resizeState,
    itemRef: resizeRef,
    handleResizeStart,
    handleResizeEnd
  } = useRoadmapResize({
    onMoveStart,
    timelineRef,
    initialWidth: width,
    project,
    onCollision
  });
  
  // Effect to find the timeline parent
  useEffect(() => {
    if (dragRef.current) {
      const parent = dragRef.current.closest('.roadmap-timeline');
      if (parent instanceof HTMLDivElement) {
        timelineRef.current = parent;
      }
    }
  }, []);

  // Synchronize refs
  useEffect(() => {
    if (dragRef.current) {
      resizeRef.current = dragRef.current;
    }
  }, [dragRef, resizeRef]);
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(project.status || 'planned');
    updateProject({
      ...project,
      status: nextStatus
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    
    const clickDuration = Date.now() - mouseDownTimeRef.current;
    
    if (clickDuration < 200 && !dragState.isDragging && !resizeState.isResizing) {
      onProjectClick(project.id);
    }
  };
  
  const handleConfirmDelete = () => {
    updateProject({
      ...project,
      isDeleted: true
    });
    setShowDeleteDialog(false);
  };
  
  useEffect(() => {
    const onMouseUp = () => {
      const result = handleMouseUp();
      if (result.isTeamChanged && result.newTeam) {
        const updatedProject = {
          ...project,
          team: result.newTeam,
        };
        updateProject(updatedProject);
        toast.success(`Project moved to ${result.newTeam} team`);
      } else if (!dragState.isDragging) {
        updateProject(project);
      }
    };
    
    const onResizeEnd = () => {
      handleResizeEnd();
      if (!resizeState.isResizing) {
        updateProject(project);
      }
    };
    
    if (dragState.isDragging) {
      document.addEventListener('mouseup', onMouseUp);
      return () => document.removeEventListener('mouseup', onMouseUp);
    }
    
    if (resizeState.isResizing) {
      document.addEventListener('mouseup', onResizeEnd);
      return () => document.removeEventListener('mouseup', onResizeEnd);
    }
    
    return undefined;
  }, [dragState.isDragging, resizeState.isResizing, project, updateProject]);
  
  // Get border style based on collision state
  const getBorderStyle = () => {
    if (dragState.isColliding || resizeState.isColliding) {
      return "border-2 border-red-500";
    }
    if (dragState.crossingTeamBoundary) {
      return "border-2 border-purple-500";
    }
    return "border";
  };

  return (
    <>
      <div
        ref={dragRef}
        className={`absolute ${teamColor} ${statusStyle} ${getBorderStyle()} rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow ${dragState.isDragging || resizeState.isResizing ? 'opacity-75 z-50' : ''} roadmap-item`}
        style={{ 
          left: dragState.isDragging ? dragState.position.left : leftPos, 
          width: resizeState.isResizing ? resizeState.itemWidth : width,
          top: dragState.isDragging ? dragState.position.top : topPos,
          minHeight: "44px" // Ensure minimum height for content
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        <RoadmapItemDetail 
          project={project}
          onStatusToggle={handleStatusToggle}
          onDelete={() => setShowDeleteDialog(true)}
        />
        
        <RoadmapItemResizeHandle onResizeStart={handleResizeStart} />
        
        <RoadmapItemOverlay
          isDragging={dragState.isDragging}
          isColliding={dragState.isColliding || resizeState.isColliding}
          crossingTeamBoundary={dragState.crossingTeamBoundary}
          projectTitle={project.title}
        />
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
