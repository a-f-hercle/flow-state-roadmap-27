
import { useState, useRef, useEffect, MouseEvent } from "react";
import { Project } from "@/types";

interface UseResizeOptions {
  onMoveStart: () => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  initialWidth: string;
  project: Project;
  onCollision?: (isColliding: boolean) => void;
}

interface ResizeState {
  isResizing: boolean;
  itemWidth: string;
  dragStartPos: { x: number; y: number };
  isColliding: boolean;
}

export function useRoadmapResize({
  onMoveStart,
  timelineRef,
  initialWidth,
  project,
  onCollision
}: UseResizeOptions) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    itemWidth: initialWidth,
    dragStartPos: { x: 0, y: 0 },
    isColliding: false
  });
  
  const itemRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef<boolean>(false);
  const mouseDownTimeRef = useRef<number>(0);
  const initialDateRef = useRef<{ startDate: Date | undefined, endDate: Date | undefined }>({
    startDate: project.startDate,
    endDate: project.endDate
  });
  
  // Team label width constant
  const TEAM_LABEL_WIDTH = 160;
  
  useEffect(() => {
    if (!resizeState.isResizing) {
      setResizeState(state => ({
        ...state,
        itemWidth: initialWidth
      }));
    }
  }, [initialWidth, resizeState.isResizing]);
  
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
    
    setResizeState(state => ({
      ...state,
      isColliding: collides
    }));
    
    if (onCollision) onCollision(collides);
    
    return collides;
  };
  
  const handleResizeStart = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeState(state => ({
      ...state,
      isResizing: true
    }));
    isResizingRef.current = true;
    onMoveStart();
    
    mouseDownTimeRef.current = Date.now();
    
    if (itemRef.current) {
      setResizeState(state => ({
        ...state,
        dragStartPos: { x: e.clientX, y: e.clientY }
      }));
    }
    
    initialDateRef.current = {
      startDate: new Date(project.startDate!),
      endDate: new Date(project.endDate!)
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResizeMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (!isResizingRef.current || !timelineRef.current || !itemRef.current) return;
    
    const parentRect = timelineRef.current.getBoundingClientRect();
    const itemRect = itemRef.current.getBoundingClientRect();
    
    const newWidth = Math.max(50, (e as MouseEvent).clientX - itemRect.left);
    
    const weekWidth = (parentRect.width - TEAM_LABEL_WIDTH) / 52;
    const weeks = Math.max(1, Math.round(newWidth / weekWidth));
    const snappedWidth = weeks * weekWidth;
    const snappedWidthPercent = (snappedWidth / (parentRect.width - TEAM_LABEL_WIDTH)) * 100;
    
    setResizeState(state => ({
      ...state,
      itemWidth: `${Math.max(2, snappedWidthPercent)}%`
    }));
    
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(project.startDate!.getTime() + (weeks * msInWeek));
    
    project.endDate = newEndDate;
    
    // Check for collisions after resize
    setTimeout(() => {
      checkCollision();
    }, 0);
  };
  
  const handleResizeEnd = () => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setResizeState(state => ({
        ...state,
        isResizing: false
      }));
      
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    }
  };
  
  return {
    resizeState,
    itemRef,
    handleResizeStart,
    handleResizeEnd
  };
}
