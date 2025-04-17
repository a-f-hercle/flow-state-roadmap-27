
import { useState, useMemo } from "react";
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

// Define team colors
const teamColors = {
  "Tech Trading": "bg-indigo-100 border-indigo-300 hover:bg-indigo-200",
  "Tech Custody & Banking": "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
  "Tech PMS": "bg-red-100 border-red-300 hover:bg-red-200",
  "Tech Execution": "bg-green-100 border-green-300 hover:bg-green-200",
  "Tech Infrastructure": "bg-orange-100 border-orange-300 hover:bg-orange-200",
  "Business Operations": "bg-pink-100 border-pink-300 hover:bg-pink-200"
};

// Define the task status styles
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
  
  // Filter projects with roadmap data
  const roadmapProjects = useMemo(() => {
    return projects.filter(project => 
      project.displayOnRoadmap && 
      project.startDate && 
      project.endDate && 
      project.status
    );
  }, [projects]);
  
  // Group projects by team
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

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // Calculate project position and width on the timeline based on dates
  // This will prevent overlaps by arranging them in rows
  const getProjectPositionAndRows = (team: string) => {
    const projects = projectsByTeam[team];
    if (!projects) return [];
    
    // Sort projects by start date
    const sortedProjects = [...projects].sort((a, b) => 
      a.startDate!.getTime() - b.startDate!.getTime()
    );
    
    const rows: {
      project: typeof projects[0];
      row: number;
      leftPos: string;
      width: string;
    }[] = [];
    
    // For each project find a row where it doesn't overlap
    sortedProjects.forEach(project => {
      const startTime = project.startDate!.getTime();
      const endTime = project.endDate!.getTime();
      
      // Find the first available row
      let rowIndex = 0;
      let foundRow = false;
      
      while (!foundRow) {
        foundRow = true;
        
        // Check if this project overlaps with any project in the current row
        for (const item of rows) {
          if (item.row === rowIndex) {
            const itemStartTime = item.project.startDate!.getTime();
            const itemEndTime = item.project.endDate!.getTime();
            
            // Check for overlap
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
      
      // Calculate position
      const startMonth = project.startDate!.getMonth();
      const startDay = project.startDate!.getDate();
      const leftPos = `${(startMonth * 100 / 12) + (startDay / 30) * (100 / 12)}%`;
      
      // Calculate width (duration in months)
      const durationInDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
      const durationInMonths = durationInDays / 30; // Approximate
      const width = `${Math.max(durationInMonths * (100 / 12), 4)}%`; // Minimum width of 4%
      
      rows.push({
        project,
        row: rowIndex,
        leftPos,
        width
      });
    });
    
    return rows;
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

  // Format date in shortened format
  const formatShortDate = (date: Date) => {
    return format(date, "MMM d");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Roadmap 2025</h1>
          <p className="text-muted-foreground">
            Planning and tracking of projects throughout 2025
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
          <p className="text-muted-foreground mb-4">No projects added to the roadmap yet.</p>
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
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Month Headers */}
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
                
                {/* Team Rows */}
                {filteredTeams.map(team => (
                  <div key={team} className="border-b last:border-b-0">
                    <div className="grid grid-cols-12 gap-0 relative">
                      {/* Team Name */}
                      <div className="absolute left-0 top-0 bottom-0 bg-white dark:bg-gray-950 z-10 p-4 flex items-center font-medium border-r">
                        <div className="w-32">{team}</div>
                      </div>
                      
                      {/* Project Blocks */}
                      <div className="col-span-12 min-h-60 pt-2 pb-4 pl-36 relative">
                        {getProjectPositionAndRows(team).map(({ project, row, leftPos, width }) => {
                          const topPos = `${row * 35 + 10}px`; // Position based on calculated row
                          
                          return (
                            <div
                              key={project.id}
                              className={`absolute ${teamColors[project.team as keyof typeof teamColors]} ${statusStyles[project.status as keyof typeof statusStyles]} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                              style={{ 
                                left: leftPos, 
                                width: width,
                                top: topPos
                              }}
                              onClick={() => handleProjectClick(project.id)}
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
                            </div>
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
      
      {/* Legend */}
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
