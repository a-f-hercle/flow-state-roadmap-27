import { useState, useMemo, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoadmapItem } from "./roadmap-item";

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

export function ProductRoadmap() {
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const { projects } = useProjects();
  const [isDragging, setIsDragging] = useState(false);
  
  const roadmapProjects = useMemo(() => {
    return projects.map(project => {
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
    toast.info("Drag to move, use resize handle to change duration", {
      id: "move-timeline-item",
      duration: 2000
    });
  }, []);

  const handleTimelineClick = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const getProjectPositionAndRows = (team: string) => {
    const projects = projectsByTeam[team];
    if (!projects) return [];
    
    const sortedProjects = [...projects].sort((a, b) => 
      a.startDate!.getTime() - b.startDate!.getTime()
    );
    
    const rows: {
      project: typeof projects[0];
      row: number;
      leftPos: string;
      width: string;
    }[] = [];
    
    sortedProjects.forEach(project => {
      const startTime = project.startDate!.getTime();
      const endTime = project.endDate!.getTime();
      
      let rowIndex = 0;
      let foundRow = false;
      
      while (!foundRow) {
        foundRow = true;
        
        for (const item of rows) {
          if (item.row === rowIndex) {
            const itemStartTime = item.project.startDate!.getTime();
            const itemEndTime = item.project.endDate!.getTime();
            
            if (!(endTime <= itemStartTime || startTime >= itemEndTime)) {
              foundRow = false;
              break;
            }
          }
        }
        
        if (!foundRow) {
          rowIndex++;
        }
      }
      
      const startMonth = project.startDate!.getMonth();
      const startDay = project.startDate!.getDate();
      const leftPos = `${(startMonth * 100 / 12) + (startDay / 30) * (100 / 12)}%`;
      
      const durationInDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
      const durationInMonths = durationInDays / 30;
      const width = `${Math.max(durationInMonths * (100 / 12), 4)}%`;
      
      rows.push({
        project,
        row: rowIndex,
        leftPos,
        width
      });
    });
    
    return rows;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Roadmap 2025</h1>
          <p className="text-muted-foreground">
            Planning and tracking of projects throughout 2025
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <em>Tip: Click to view details, right-click and drag to move, or use handle to resize</em>
          </p>
        </div>
        <Button 
          onClick={() => navigate("/projects/new?roadmap=true")}
        >
          Add to Roadmap
        </Button>
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
          <CardContent onClick={handleTimelineClick}>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <div className="grid grid-cols-12 gap-0 border-b">
                  {Array.from({ length: 12 }).map((_, index) => {
                    const date = new Date(2025, index, 1);
                    return (
                      <div key={index} className="p-2 text-center text-sm font-medium">
                        {format(date, 'MMMM')}
                      </div>
                    );
                  })}
                </div>
                
                {filteredTeams.map(team => (
                  <div key={team} className="border-b last:border-b-0">
                    <div className="grid grid-cols-12 gap-0 relative">
                      <div className="absolute left-0 top-0 bottom-0 bg-white dark:bg-gray-950 z-10 p-4 flex items-center font-medium border-r">
                        <div className="w-32">{team}</div>
                      </div>
                      
                      <div className="col-span-12 min-h-60 pt-2 pb-8 pl-36 relative roadmap-timeline">
                        {getProjectPositionAndRows(team).map(({ project, row, leftPos, width }) => {
                          const topPos = `${row * 45 + 8}px`;
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
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
