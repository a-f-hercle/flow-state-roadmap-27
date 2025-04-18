import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoadmapItem } from "./roadmap-item";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
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
import { Project } from "@/types";

const teamColors = {
  "Tech Trading": "bg-indigo-100 border-indigo-300 hover:bg-indigo-200",
  "Tech Custody & Banking": "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
  "Tech PMS": "bg-red-100 border-red-300 hover:bg-red-200",
  "Tech Execution": "bg-green-100 border-green-300 hover:bg-green-200",
  "Tech Infrastructure": "bg-orange-100 border-orange-300 hover:bg-orange-200",
  "Business Operations": "bg-pink-100 border-pink-300 hover:bg-pink-200"
};

const statusStyles = {
  "completed": "border-l-4 border-l-green-500",
  "in-progress": "border-l-4 border-l-blue-500",
  "planned": "border-l-4 border-l-amber-500",
  "blocked": "border-l-4 border-l-red-500"
};

// Row height constant for consistent calculations
const ROW_HEIGHT = 45;
const MIN_CONTAINER_HEIGHT = 60;
// Define the width of the team label column
const TEAM_LABEL_WIDTH = 160; // 40 * 4 = 160px (w-40)

export function ProductRoadmap() {
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const { projects, updateProject } = useProjects();
  const [isDragging, setIsDragging] = useState(false);
  const [showTrashBin, setShowTrashBin] = useState(false);
  const [projectToRestore, setProjectToRestore] = useState<Project | null>(null);
  const [projectToPermanentDelete, setProjectToPermanentDelete] = useState<Project | null>(null);
  const [expandingTeam, setExpandingTeam] = useState<string | null>(null);
  const [teamHeights, setTeamHeights] = useState<Record<string, number>>({});
  const teamRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const timelineRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const roadmapProjects = useMemo(() => {
    return projects
      .filter(project => !project.isDeleted) // Only show non-deleted projects
      .map(project => {
        return {
          ...project,
          startDate: project.startDate || new Date(),
          endDate: project.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: project.status || 'planned'
        };
      });
  }, [projects]);
  
  const deletedProjects = useMemo(() => {
    return projects
      .filter(project => project.isDeleted)
      .map(project => {
        return {
          ...project,
          startDate: project.startDate || new Date(),
          endDate: project.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: project.status || 'planned'
        };
      });
  }, [projects]);
  
  const projectsByTeam = useMemo(() => {
    const grouped = roadmapProjects.reduce((groups, project) => {
      if (!groups[project.team]) {
        groups[project.team] = [];
      }
      groups[project.team].push(project);
      return groups;
    }, {} as Record<string, typeof roadmapProjects>);
    
    return grouped;
  }, [roadmapProjects]);
  
  const teams = Object.keys(projectsByTeam);
  
  const toggleTeam = (team: string) => {
    setSelectedTeams(current => 
      current.includes(team) 
        ? current.filter(t => t !== team) 
        : [...current, team]
    );
  };
  
  const filteredTeams = selectedTeams.length > 0 
    ? selectedTeams 
    : teams;

  const handleProjectClick = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  const handleMoveStart = useCallback(() => {
    setIsDragging(true);
    toast.info("Right-click or use Alt+click to drag items. Use resize handle to adjust duration.", {
      id: "move-timeline-item",
      duration: 3000
    });
  }, []);

  const handleTimelineClick = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
    
    // Clear expansion indicator when clicking on timeline
    setExpandingTeam(null);
  }, [isDragging]);

  const handleTrashBinToggle = () => {
    setShowTrashBin(!showTrashBin);
  };

  const handleRestoreProject = (project: Project) => {
    setProjectToRestore(project);
  };

  const confirmRestore = () => {
    if (projectToRestore) {
      updateProject({
        ...projectToRestore,
        isDeleted: false
      });
      toast.success(`Project "${projectToRestore.title}" has been restored`);
      setProjectToRestore(null);
    }
  };

  const handlePermanentDelete = (project: Project) => {
    setProjectToPermanentDelete(project);
  };

  const confirmPermanentDelete = () => {
    if (projectToPermanentDelete) {
      toast.success(`Project "${projectToPermanentDelete.title}" has been permanently deleted`);
      setProjectToPermanentDelete(null);
    }
  };

  // Handle item drag move to show expansion indicator and expand container if needed
  const handleDragMove = useCallback((team: string, rowIndex: number) => {
    // Set the team that needs expansion if the row is beyond current rows
    const { rows, maxRow } = getProjectPositionAndRows(team);
    
    // If dragging beyond current rows, show expansion indicator and increase container height
    if (rowIndex > maxRow) {
      setExpandingTeam(team);
      
      // Calculate new container height
      const newHeight = (rowIndex + 1) * ROW_HEIGHT + 16; // +16 for padding
      
      // Update the height for this specific team
      setTeamHeights(prev => ({
        ...prev,
        [team]: Math.max(newHeight, MIN_CONTAINER_HEIGHT)
      }));
    } else {
      // Only clear indicator if this team is currently showing as expanding
      if (expandingTeam === team) {
        setExpandingTeam(null);
      }
    }
  }, [expandingTeam, projectsByTeam]);

  const getProjectPositionAndRows = (team: string) => {
    const projects = projectsByTeam[team] || [];
    
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
      project: typeof projects[0];
      row: number;
      leftPos: string;
      width: string;
    }[] = [];
    
    // Tracking occupied time ranges in each row
    const rowOccupancy: { start: number; end: number }[][] = [];
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
      rowOccupancy[rowIndex].push({ start: startTime, end: endTime });
      
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
        width
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

  // Reset team heights when teams change
  useEffect(() => {
    const newHeights: Record<string, number> = {};
    teams.forEach(team => {
      const { maxRow } = getProjectPositionAndRows(team);
      const calculatedHeight = Math.max((maxRow + 1) * ROW_HEIGHT + 16, MIN_CONTAINER_HEIGHT);
      newHeights[team] = calculatedHeight;
    });
    setTeamHeights(newHeights);
  }, [teams, projects]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Roadmap 2025</h1>
          <p className="text-muted-foreground">
            Planning and tracking of projects throughout 2025
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <em>Tip: Right-click or use Alt+click to drag items, click to open details, use the handle on the right to resize</em>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={handleTrashBinToggle}
            title="View trash bin"
            className="relative"
          >
            <Trash2 className="h-4 w-4" />
            {deletedProjects.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {deletedProjects.length}
              </span>
            )}
          </Button>
          <Button onClick={() => navigate("/projects/new?roadmap=true")}>
            Add to Roadmap
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {teams.map(team => (
          <Badge 
            key={team}
            variant={selectedTeams.includes(team) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTeam(team)}
          >
            {team}
          </Badge>
        ))}
      </div>
      
      {teams.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No projects with timeline data available.</p>
          <Button 
            onClick={() => navigate("/projects/new?roadmap=true")}
          >
            Add Your First Project to Roadmap
          </Button>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>2025 Roadmap</CardTitle>
          </CardHeader>
          <CardContent onClick={handleTimelineClick} className="relative">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <div className="grid grid-cols-12 gap-0 border-b ml-40">
                  {Array.from({ length: 12 }).map((_, index) => {
                    const date = new Date(2025, index, 1);
                    return (
                      <div key={index} className="p-2 text-center text-sm font-medium">
                        {format(date, 'MMMM')}
                      </div>
                    );
                  })}
                </div>
                
                <div className="relative">
                  {filteredTeams.map((team, teamIndex) => {
                    const { rows, containerHeight } = getProjectPositionAndRows(team);
                    return (
                      <div 
                        key={team} 
                        className={`flex border-b ${teamIndex === filteredTeams.length - 1 ? 'border-b-0' : ''}`}
                        ref={el => teamRefs.current[team] = el}
                      >
                        <div className="sticky left-0 w-40 bg-white dark:bg-gray-950 z-10 p-4 flex items-center font-medium border-r">
                          {team}
                        </div>
                        
                        <div 
                          className={`flex-1 relative roadmap-timeline`} 
                          style={{ height: containerHeight }}
                          ref={el => timelineRefs.current[team] = el}
                        >
                          <div className="grid grid-cols-12 h-full">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className="border-r last:border-r-0 h-full">
                                {Array.from({ length: 4 }).map((_, j) => (
                                  <div key={j} className="flex-1 h-full border-r last:border-r-0 border-dashed border-gray-100 dark:border-gray-800" />
                                ))}
                              </div>
                            ))}
                          </div>
                          
                          {/* Expansion indicator at the bottom */}
                          {expandingTeam === team && (
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-purple-500 z-20 animate-pulse" />
                          )}
                          
                          <div className="absolute inset-0 pt-2 pb-8">
                            {rows.map(({ project, row, leftPos, width }) => {
                              const topPos = `${row * ROW_HEIGHT + 8}px`;
                              const projectStatus = project.status || 'planned';
                              
                              return (
                                <RoadmapItem
                                  key={project.id}
                                  project={project}
                                  teamColor={teamColors[project.team as keyof typeof teamColors]}
                                  statusStyle={statusStyles[projectStatus as keyof typeof statusStyles]}
                                  leftPos={leftPos}
                                  width={width}
                                  topPos={topPos}
                                  onMoveStart={handleMoveStart}
                                  onProjectClick={handleProjectClick}
                                  onDragMove={(rowIndex) => handleDragMove(team, rowIndex)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-wrap gap-4 items-center justify-end">
        <div className="text-sm font-medium">Status:</div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span className="text-sm">Planned</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Blocked</span>
        </div>
      </div>
      
      <Dialog open={showTrashBin} onOpenChange={setShowTrashBin}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Trash Bin</DialogTitle>
            <DialogDescription>
              Projects that have been deleted. You can restore them or delete them permanently.
            </DialogDescription>
          </DialogHeader>
          
          {deletedProjects.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No deleted projects found</p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {deletedProjects.map(project => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50"
                >
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Badge className="mr-2">{project.team}</Badge>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(project.startDate!), "MMM d")} - {format(new Date(project.endDate!), "MMM d")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRestoreProject(project)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handlePermanentDelete(project)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete Forever
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!projectToRestore} onOpenChange={() => projectToRestore && setProjectToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore project?</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToRestore && `This will restore the project "${projectToRestore.title}" back to the roadmap.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={!!projectToPermanentDelete} onOpenChange={() => projectToPermanentDelete && setProjectToPermanentDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToPermanentDelete && `This will permanently delete the project "${projectToPermanentDelete.title}". This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmPermanentDelete}
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
