
import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";

// Helper function to categorize projects by team
function groupProjectsByTeam(projects: Project[]) {
  return projects.reduce((groups, project) => {
    if (!groups[project.team]) {
      groups[project.team] = [];
    }
    groups[project.team].push(project);
    return groups;
  }, {} as Record<string, Project[]>);
}

// Helper function to get month labels
function getMonthLabels() {
  return [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
}

// Helper function to determine project color based on team
function getProjectColor(team: string): string {
  const colors: Record<string, string> = {
    "Tech Trading": "bg-indigo-100 border-indigo-300",
    "Tech Custody & Banking": "bg-yellow-100 border-yellow-300",
    "Tech PMS": "bg-red-100 border-red-300",
    "Tech Execution": "bg-green-100 border-green-300",
    "Tech Infrastructure": "bg-orange-100 border-orange-300",
    "Business Operations": "bg-pink-100 border-pink-300"
  };
  
  return colors[team] || "bg-gray-100 border-gray-300";
}

export function ProductRoadmap() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  
  const projectsByTeam = useMemo(() => groupProjectsByTeam(projects), [projects]);
  const teams = Object.keys(projectsByTeam);
  const months = getMonthLabels();
  
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

  // Calculate project position on the timeline based on creation date
  const getProjectPosition = (project: Project) => {
    const creationDate = new Date(project.createdAt);
    const month = creationDate.getMonth();
    const day = creationDate.getDate();
    
    // Approximate positioning
    const leftPos = `${(month * 100 / 12) + (day / 30) * (100 / 12)}%`;
    
    // Calculate width based on project phase - early phases are smaller, later phases are wider
    const phaseWidths: Record<string, number> = {
      'proposal': 1,
      'build': 2,
      'release': 1.5,
      'results': 1
    };
    
    const width = `${phaseWidths[project.currentPhase] * (100 / 12)}%`;
    
    return { leftPos, width };
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Roadmap</h1>
        <p className="text-muted-foreground">
          Planning and tracking of projects throughout the year
        </p>
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
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>2023 Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Month Headers */}
              <div className="grid grid-cols-12 gap-0 border-b">
                {months.map(month => (
                  <div key={month} className="p-2 text-center text-sm font-medium">
                    {month}
                  </div>
                ))}
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
                    <div className="col-span-12 min-h-36 pt-2 pb-4 pl-36 relative">
                      {projectsByTeam[team].map(project => {
                        const { leftPos, width } = getProjectPosition(project);
                        
                        return (
                          <div
                            key={project.id}
                            className={`absolute ${getProjectColor(project.team)} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                            style={{ 
                              left: leftPos, 
                              width: width,
                              top: '10px'
                            }}
                            onClick={() => handleProjectClick(project.id)}
                          >
                            <div className="text-sm font-medium truncate">{project.title}</div>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <Badge 
                                variant="outline" 
                                className="text-[10px] h-4 py-0"
                              >
                                {project.currentPhase}
                              </Badge>
                              <Badge 
                                className="text-[10px] h-4 py-0 bg-blue-500 text-white"
                              >
                                {project.owner}
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
    </div>
  );
}
