import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleDashed,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskCategory, TaskStatus } from "@/types";

// Same mock data as in product-roadmap.tsx for simplicity
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

const categoryColors: Record<TaskCategory, string> = {
  feature: "bg-blue-500",
  bugfix: "bg-red-500",
  improvement: "bg-green-500",
  refactor: "bg-yellow-500",
  infrastructure: "bg-purple-500",
  documentation: "bg-gray-500"
};

const statusIcons: Record<TaskStatus, any> = {
  "completed": CheckCircle2,
  "in-progress": CircleDashed,
  "planned": Circle,
  "blocked": AlertCircle
};

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const task = mockTasks.find(task => task.id === id);
  
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Task not found</h2>
        <Button onClick={() => navigate("/roadmap")}>Back to Roadmap</Button>
      </div>
    );
  }
  
  const StatusIcon = statusIcons[task.status];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/roadmap")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-500' : task.status === 'blocked' ? 'text-red-500' : 'text-muted-foreground'}`} />
                <span>Status: <span className="font-medium capitalize">{task.status}</span></span>
              </div>
              <Badge className={`${categoryColors[task.category]} text-white`}>
                {task.category}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Start Date:</span>
                <span className="font-medium">
                  {format(task.startDate, "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">End Date:</span>
                <span className="font-medium">
                  {format(task.endDate, "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">ETA:</span>
                <span className="font-medium">
                  {Math.round((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Team:</span>
                <span className="font-medium">{task.team}</span>
              </div>
              
              {task.assignee && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mr-2">Assignee:</span>
                  <span className="font-medium">{task.assignee}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pt-2">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-4"></div>
              
              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Task Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(task.startDate, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                  <CircleDashed className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Work Started</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(task.startDate.getTime() + 86400000), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {task.status === 'completed' ? (
                <div className="relative pl-10">
                  <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {format(task.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-10">
                  <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Expected Completion</p>
                    <p className="text-sm text-muted-foreground">
                      {format(task.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
