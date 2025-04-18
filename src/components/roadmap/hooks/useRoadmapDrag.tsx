
import { useState, useRef, useEffect, MouseEvent } from "react";
import { Project } from "@/types";

interface UseDragOptions {
  onMoveStart: () => void;
  onDragMove?: (rowIndex: number) => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  initialLeftPos: string;
  initialTopPos: string;
  teamBoundaries: { name: string, top: number, bottom: number }[];
  project: Project;
  onCollision?: (isColliding: boolean) => void;
}

interface DragState {
  isDragging: boolean;
  position: { left: string; top: string };
  dragStartPos: { x: number; y: number };
  crossingTeamBoundary: string | null;
  isColliding: boolean;
}

export function useRoadmapDrag({
  onMoveStart,
  onDragMove,
  timelineRef,
  initialLeftPos,
  initialTopPos,
  teamBoundaries,
  project,
  onCollision
}: UseDragOptions) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    position: { left: initialLeftPos, top: initialTopPos },
    dragStartPos: { x: 0, y: 0 },
    crossingTeamBoundary: null,
    isColliding: false
  });
  
  const itemRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const mouseDownTimeRef = useRef<number>(0);
  const initialDateRef = useRef<{ startDate: Date | undefined, endDate: Date | undefined }>({
    startDate: project.startDate,
    endDate: project.endDate
  });
  const currentRowRef = useRef<number>(0);
  const currentTeamRef = useRef<string>(project.team);
  
  // Team label width constant
  const TEAM_LABEL_WIDTH = 160;
  
  useEffect(() => {
    if (!dragState.isDragging) {
      setDragState(state => ({
        ...state,
        position: { left: initialLeftPos, top: initialTopPos }
      }));
    }
  }, [initialLeftPos, initialTopPos, dragState.isDragging]);
  
  const checkTeamBoundary = (clientY: number) => {
    if (!teamBoundaries.length) return null;
    
    for (const boundary of teamBoundaries) {
      if (clientY >= boundary.top && clientY <= boundary.bottom) {
        return boundary.name;
      }
    }
    
    return null;
  };
  
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
    
    setDragState(state => ({
      ...state,
      isColliding: collides
    }));
    
    if (onCollision) onCollision(collides);
    
    return collides;
  };
  
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
    mouseDownTimeRef.current = Date.now();
    
    if (e.button === 2 || e.altKey || e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      setDragState(state => ({
        ...state,
        isDragging: true
      }));
      isDraggingRef.current = true;
      onMoveStart();
      
      if (timelineRef.current && itemRef.current) {
        const parentRect = timelineRef.current.getBoundingClientRect();
        const itemRect = itemRef.current.getBoundingClientRect();
        
        setDragState(state => ({
          ...state,
          dragStartPos: {
            x: e.clientX - (itemRect.left - parentRect.left),
            y: e.clientY - (itemRect.top - parentRect.top)
          }
        }));
      }
      
      initialDateRef.current = {
        startDate: new Date(project.startDate!),
        endDate: new Date(project.endDate!)
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (!isDraggingRef.current || !timelineRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    
    const timelineStart = TEAM_LABEL_WIDTH;
    const mouseXRelativeToTimeline = (e as MouseEvent).clientX - parentRect.left - timelineStart;
    
    const adjustedLeft = Math.max(0, mouseXRelativeToTimeline);
    
    const newTop = (e as MouseEvent).clientY - parentRect.top - dragState.dragStartPos.y;
    
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
    const newTeam = checkTeamBoundary((e as MouseEvent).clientY);
    if (newTeam && newTeam !== currentTeamRef.current) {
      setDragState(state => ({
        ...state,
        crossingTeamBoundary: newTeam
      }));
    } else {
      setDragState(state => ({
        ...state,
        crossingTeamBoundary: null
      }));
    }
    
    setDragState(state => ({
      ...state,
      position: {
        left: leftPercent,
        top: topPx
      }
    }));
    
    const startDate = new Date(2025, 0, 1);
    const weekIndex = Math.floor((snapToWeek / (parentRect.width - timelineStart)) * 52);
    
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newStartDate = new Date(startDate.getTime() + (weekIndex * msInWeek));
    
    const duration = initialDateRef.current.endDate!.getTime() - initialDateRef.current.startDate!.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);
    
    // Update project dates
    project.startDate = newStartDate;
    project.endDate = newEndDate;
    
    // Check for collisions
    setTimeout(() => {
      checkCollision();
    }, 0);
  };
  
  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setDragState(state => ({
        ...state,
        isDragging: false
      }));
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      return {
        isTeamChanged: dragState.crossingTeamBoundary !== null && dragState.crossingTeamBoundary !== project.team,
        newTeam: dragState.crossingTeamBoundary
      };
    }
    return { isTeamChanged: false, newTeam: null };
  };
  
  return {
    dragState,
    itemRef,
    handleMouseDown,
    handleMouseUp,
    checkCollision
  };
}
