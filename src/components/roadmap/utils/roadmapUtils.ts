import { Project } from "@/types";

// Constants for calculations
const ROW_HEIGHT = 45;
const MIN_CONTAINER_HEIGHT = 60;

/**
 * Calculates project positions and rows for the roadmap
 */
export const getProjectPositionAndRows = (
  team: string, 
  projects: Project[],
  teamHeights: Record<string, number>
) => {
  // If no projects, return empty data
  if (projects.length === 0) {
    return { 
      rows: [], 
      containerHeight: teamHeights[team] || MIN_CONTAINER_HEIGHT,
      maxRow: -1
    };
  }
  
  const sortedProjects = [...projects].sort((a, b) => 
    a.startDate!.getTime() - b.startDate!.getTime()
  );
  
  const rows: {
    project: Project;
    row: number;
    leftPos: string;
    width: string;
    isLastRow: boolean;
  }[] = [];
  
  // Tracking occupied time ranges in each row
  const rowOccupancy: { start: number; end: number; projectId: string }[][] = [];
  let maxRow = -1;
  
  sortedProjects.forEach(project => {
    const startTime = project.startDate!.getTime();
    const endTime = project.endDate!.getTime();
    
    // Find first available row where this project can fit
    let rowIndex = 0;
    let foundRow = false;
    
    while (!foundRow) {
      // Check if this row exists in our occupancy tracker
      if (!rowOccupancy[rowIndex]) {
        rowOccupancy[rowIndex] = [];
        foundRow = true;
      } else {
        foundRow = true;
        
        // Check if project overlaps with any existing project in this row
        for (const timeRange of rowOccupancy[rowIndex]) {
          if (!(endTime <= timeRange.start || startTime >= timeRange.end)) {
            foundRow = false;
            break;
          }
        }
      }
      
      if (!foundRow) {
        rowIndex++;
      }
    }
    
    // Keep track of the maximum row index used
    maxRow = Math.max(maxRow, rowIndex);
    
    // Add this project's time range to the row's occupancy
    rowOccupancy[rowIndex].push({ 
      start: startTime, 
      end: endTime,
      projectId: project.id
    });
    
    const startDate = new Date(2025, 0, 1);
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksFromStart = (startTime - startDate.getTime()) / msInWeek;
    const projectDurationInWeeks = (endTime - startTime) / msInWeek;
    
    const leftPos = `${(weeksFromStart * 100) / 52}%`;
    const width = `${Math.max((projectDurationInWeeks * 100) / 52, 2)}%`;
    
    rows.push({
      project,
      row: rowIndex,
      leftPos,
      width,
      isLastRow: rowIndex === maxRow
    });
  });
  
  // Use the saved custom height if available, otherwise calculate based on rows
  const calculatedHeight = Math.max((maxRow + 1) * ROW_HEIGHT + 16, MIN_CONTAINER_HEIGHT);
  const containerHeight = teamHeights[team] || calculatedHeight;
  
  return {
    rows,
    containerHeight: `${containerHeight}px`,
    maxRow
  };
};

/**
 * Organizes projects by team
 */
export const groupProjectsByTeam = (projects: Project[]): Record<string, Project[]> => {
  return projects.reduce((groups, project) => {
    if (!groups[project.team]) {
      groups[project.team] = [];
    }
    groups[project.team].push(project);
    return groups;
  }, {} as Record<string, Project[]>);
};

/**
 * Calculates team boundaries based on DOM elements
 */
export const calculateTeamBoundaries = (
  teamRefs: Record<string, HTMLDivElement | null>,
  filteredTeams: string[],
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const boundaries: { name: string, top: number, bottom: number }[] = [];
  
  Object.entries(teamRefs).forEach(([team, ref]) => {
    if (ref && filteredTeams.includes(team)) {
      const rect = ref.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0 };
      
      boundaries.push({
        name: team,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top
      });
    }
  });
  
  return boundaries;
};
