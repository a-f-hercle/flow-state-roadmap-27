
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
import { Task, TaskCategory } from "@/types";
import { useNavigate } from "react-router-dom";

// Sample mock data for the roadmap
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "High Availability",
    description: "Implement high availability for the trading platform",
    category: "infrastructure",
    status: "completed",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 1, 15),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-2",
    title: "Pricing Adjustment",
    description: "Adjust pricing algorithms based on market trends",
    category: "feature",
    status: "completed",
    startDate: new Date(2023, 1, 10),
    endDate: new Date(2023, 2, 5),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-3",
    title: "DNSH Integration - Taxes",
    description: "Integrate tax calculation system with DNSH",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2023, 2, 1),
    endDate: new Date(2023, 3, 15),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-4",
    title: "Delayed Settlement",
    description: "Implement delayed settlement functionality",
    category: "feature",
    status: "planned",
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2023, 4, 20),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-5",
    title: "Bank Integration",
    description: "Integrate with major banks APIs",
    category: "feature",
    status: "completed",
    startDate: new Date(2023, 0, 15),
    endDate: new Date(2023, 1, 28),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-6",
    title: "ExportTxt",
    description: "Add export to text file functionality",
    category: "feature",
    status: "completed",
    startDate: new Date(2023, 1, 20),
    endDate: new Date(2023, 2, 10),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-7",
    title: "Accounting System & Reporting",
    description: "Build new accounting and reporting system",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2023, 0, 5),
    endDate: new Date(2023, 2, 25),
    team: "Tech PMS",
    color: "bg-red-100 border-red-300"
  },
  {
    id: "task-8",
    title: "High Availability",
    description: "Improve system uptime and reliability",
    category: "infrastructure",
    status: "completed",
    startDate: new Date(2023, 0, 10),
    endDate: new Date(2023, 2, 15),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-9",
    title: "Staging env",
    description: "Set up new staging environment",
    category: "infrastructure",
    status: "planned",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 0, 31),
    team: "Tech Infrastructure",
    color: "bg-orange-100 border-orange-300"
  },
  {
    id: "task-10",
    title: "Product - Commercial - Tech - Process",
    description: "Streamline cross-departmental workflows",
    category: "improvement",
    status: "planned",
    startDate: new Date(2023, 1, 15),
    endDate: new Date(2023, 3, 15),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  }
];

// Helper function to categorize tasks by team
function groupTasksByTeam(tasks: Task[]) {
  return tasks.reduce((groups, task) => {
    if (!groups[task.team]) {
      groups[task.team] = [];
    }
    groups[task.team].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
}

// Helper function to get month labels
function getMonthLabels() {
  return [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
}

const categoryColors: Record<TaskCategory, string> = {
  feature: "bg-blue-500",
  bugfix: "bg-red-500",
  improvement: "bg-green-500",
  refactor: "bg-yellow-500",
  infrastructure: "bg-purple-500",
  documentation: "bg-gray-500"
};

export function ProductRoadmap() {
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  
  const tasksByTeam = useMemo(() => groupTasksByTeam(mockTasks), []);
  const teams = Object.keys(tasksByTeam);
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

  const handleTaskClick = (taskId: string) => {
    navigate(`/roadmap/tasks/${taskId}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>
        <p className="text-muted-foreground">
          Planning and tracking of product development throughout the year
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
                    
                    {/* Task Blocks */}
                    <div className="col-span-12 min-h-36 pt-2 pb-4 pl-36 relative">
                      {tasksByTeam[team].map(task => {
                        // Calculate task position and width based on dates
                        const startMonth = task.startDate.getMonth();
                        const endMonth = task.endDate.getMonth();
                        const startDay = task.startDate.getDate();
                        const endDay = task.endDate.getDate();
                        
                        // Approximate positioning (can be refined for more accuracy)
                        const leftPos = `${(startMonth * 100 / 12) + (startDay / 30) * (100 / 12)}%`;
                        const width = `${((endMonth - startMonth) * 100 / 12) + ((endDay - startDay) / 30) * (100 / 12)}%`;
                        
                        return (
                          <div
                            key={task.id}
                            className={`absolute ${task.color} border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                            style={{ 
                              left: leftPos, 
                              width: width,
                              top: '10px'
                            }}
                            onClick={() => handleTaskClick(task.id)}
                          >
                            <div className="text-sm font-medium truncate">{task.title}</div>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <Badge 
                                variant="outline" 
                                className="text-[10px] h-4 py-0"
                              >
                                {task.status}
                              </Badge>
                              <Badge 
                                className={`text-[10px] h-4 py-0 ${categoryColors[task.category]} text-white`}
                              >
                                {task.category}
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
