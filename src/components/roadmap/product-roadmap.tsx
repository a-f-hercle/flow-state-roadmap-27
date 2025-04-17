
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
import { mockTasks } from "@/data/mock-data";

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
  
  // Group tasks by team
  const tasksByTeam = useMemo(() => {
    const grouped = mockTasks.reduce((groups, task) => {
      if (!groups[task.team]) {
        groups[task.team] = [];
      }
      groups[task.team].push(task);
      return groups;
    }, {} as Record<string, typeof mockTasks>);
    
    return grouped;
  }, []);
  
  const teams = Object.keys(tasksByTeam);
  
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

  const handleTaskClick = (taskId: string) => {
    navigate(`/roadmap/tasks/${taskId}`);
  };

  // Calculate task position and width on the timeline
  const getTaskPosition = (task: typeof mockTasks[0]) => {
    const startMonth = task.startDate.getMonth();
    const startDay = task.startDate.getDate();
    const endMonth = task.endDate.getMonth();
    const endDay = task.endDate.getDate();
    
    // Position calculation (percentage from left)
    const leftPos = `${(startMonth * 100 / 12) + (startDay / 30) * (100 / 12)}%`;
    
    // Width calculation (duration in months)
    const durationInDays = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const durationInMonths = durationInDays / 30; // Approximate
    const width = `${Math.max(durationInMonths * (100 / 12), 4)}%`; // Minimum width of 4%
    
    return { leftPos, width };
  };
  
  // Get status label
  const getStatusLabel = (status: string) => {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Roadmap 2025</h1>
        <p className="text-muted-foreground">
          Planning and tracking of projects throughout 2025
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
                    
                    {/* Task Blocks */}
                    <div className="col-span-12 min-h-60 pt-2 pb-4 pl-36 relative">
                      {tasksByTeam[team].map((task, index) => {
                        const { leftPos, width } = getTaskPosition(task);
                        const topPos = `${(index % 3) * 35 + 10}px`; // Stagger tasks vertically (up to 3 rows)
                        
                        return (
                          <div
                            key={task.id}
                            className={`absolute ${teamColors[task.team as keyof typeof teamColors]} ${statusStyles[task.status as keyof typeof statusStyles]} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                            style={{ 
                              left: leftPos, 
                              width: width,
                              top: topPos
                            }}
                            onClick={() => handleTaskClick(task.id)}
                          >
                            <div className="text-sm font-medium truncate">{task.title}</div>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>
                                  {formatShortDate(task.startDate)} - {formatShortDate(task.endDate)}
                                </span>
                              </div>
                              <Badge 
                                className={`text-[10px] h-4 py-0 ${
                                  task.status === 'completed' ? 'bg-green-500' : 
                                  task.status === 'in-progress' ? 'bg-blue-500' : 
                                  task.status === 'blocked' ? 'bg-red-500' : 'bg-amber-500'
                                }`}
                              >
                                {getStatusLabel(task.status)}
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
