
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Project } from "@/types";

// Import utility functions and components
import { getProjectPositionAndRows, groupProjectsByTeam, calculateTeamBoundaries } from "./utils/roadmapUtils";
import { TeamTimeline } from "./components/TeamTimeline";
import { TrashBinDialog } from "./components/TrashBinDialog";

// Constants for styling
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
const TEAM_LABEL_WIDTH = 160;

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
  const [teamBoundaries, setTeamBoundaries] = useState<{ name: string, top: number, bottom: number }[]>([]);
  const [hasCollisions, setHasCollisions] = useState(false);
  const teamRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const roadmapContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Filter projects for the roadmap and deleted projects
  const roadmapProjects = useMemo(() => {
    return projects
      .filter(project => !project.isDeleted)
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
  
  // Group projects by team
  const projectsByTeam = useMemo(() => {
    return groupProjectsByTeam(roadmapProjects);
  }, [roadmapProjects]);
  
  // Get available teams from projects
  const teams = Object.keys(projectsByTeam);
  
  // Handle team selection
  const toggleTeam = (team: string) => {
    setSelectedTeams(current => 
      current.includes(team) 
        ? current.filter(t => t !== team) 
        : [...current, team]
    );
  };
  
  // Get teams to display based on selection
  const filteredTeams = selectedTeams.length > 0 
    ? selectedTeams 
    : teams;

  // Update team boundaries whenever the DOM updates
  useEffect(() => {
    const updateTeamBoundaries = () => {
      const boundaries = calculateTeamBoundaries(teamRefs.current, filteredTeams, roadmapContainerRef);
      setTeamBoundaries(boundaries);
    };
    
    updateTeamBoundaries();
    
    // Set up resize observer to track changes
    const resizeObserver = new ResizeObserver(() => {
      updateTeamBoundaries();
    });
    
    if (roadmapContainerRef.current) {
      resizeObserver.observe(roadmapContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [filteredTeams, teamHeights]);

  // Event handlers
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
    const { maxRow } = getProjectPositionAndRows(team, projectsByTeam[team] || [], teamHeights);
    
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
  }, [expandingTeam, projectsByTeam, teamHeights]);

  const handleCollisionChange = (isColliding: boolean) => {
    if (isColliding) {
      setHasCollisions(true);
    }
  };

  // Reset team heights when teams change
  useEffect(() => {
    const newHeights: Record<string, number> = {};
    teams.forEach(team => {
      const { maxRow } = getProjectPositionAndRows(team, projectsByTeam[team] || [], {});
      const calculatedHeight = Math.max((maxRow + 1) * ROW_HEIGHT + 16, MIN_CONTAINER_HEIGHT);
      newHeights[team] = calculatedHeight;
    });
    setTeamHeights(newHeights);
  }, [teams, projectsByTeam]);

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
      
      {hasCollisions && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Project collision detected</h3>
            <p className="text-amber-700 text-sm">Some projects are overlapping on the roadmap. Try repositioning them for better visibility.</p>
          </div>
        </div>
      )}
      
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
          <CardContent ref={roadmapContainerRef} onClick={handleTimelineClick} className="relative">
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
                    const { rows, containerHeight } = getProjectPositionAndRows(team, projectsByTeam[team] || [], teamHeights);
                    return (
                      <div 
                        key={team} 
                        className={`flex border-b ${teamIndex === filteredTeams.length - 1 ? 'border-b-0' : ''}`}
                        ref={el => teamRefs.current[team] = el}
                      >
                        <div className="sticky left-0 w-40 bg-white dark:bg-gray-950 z-10 p-4 flex items-center font-medium border-r">
                          {team}
                        </div>
                        
                        <TeamTimeline 
                          team={team}
                          containerHeight={containerHeight}
                          rows={rows}
                          teamBoundaries={teamBoundaries}
                          onMoveStart={handleMoveStart}
                          onProjectClick={handleProjectClick}
                          onDragMove={(rowIndex) => handleDragMove(team, rowIndex)}
                          isExpanding={expandingTeam === team}
                          teamColors={teamColors}
                          statusStyles={statusStyles}
                          onCollisionChange={handleCollisionChange}
                        />
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
      
      <TrashBinDialog 
        open={showTrashBin}
        onOpenChange={setShowTrashBin}
        deletedProjects={deletedProjects}
        onRestore={handleRestoreProject}
        onDelete={handlePermanentDelete}
        projectToRestore={projectToRestore}
        setProjectToRestore={setProjectToRestore}
        projectToPermanentDelete={projectToPermanentDelete}
        setProjectToPermanentDelete={setProjectToPermanentDelete}
        onConfirmRestore={confirmRestore}
        onConfirmPermanentDelete={confirmPermanentDelete}
      />
    </div>
  );
}
