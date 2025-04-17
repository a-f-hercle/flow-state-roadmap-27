
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
import { TaskCategory, TaskStatus } from "@/types";
import { mockTasks } from "@/data/mock-data";

const categoryColors: Record<TaskCategory, string> = {
  feature: "bg-blue-500",
  bugfix: "bg-red-500",
  improvement: "bg-green-500",
  refactor: "bg-yellow-500",
  infrastructure: "bg-purple-500",
  documentation: "bg-gray-500",
  compliance: "bg-teal-500",
  security: "bg-orange-500"
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
                <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-500' : task.status === 'blocked' ? 'text-red-500' : task.status === 'in-progress' ? 'text-blue-500' : 'text-amber-500'}`} />
                <span>Status: <span className="font-medium capitalize">{task.status}</span></span>
              </div>
              {task.category && (
                <Badge className={`${categoryColors[task.category as keyof typeof categoryColors]} text-white`}>
                  {task.category}
                </Badge>
              )}
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
                <span className="text-sm text-muted-foreground mr-2">Duration:</span>
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
                    {format(new Date(task.startDate.getTime() - 86400000 * 5), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Scheduled Start</p>
                  <p className="text-sm text-muted-foreground">
                    {format(task.startDate, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {task.status === 'in-progress' && (
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                    <CircleDashed className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Work Started</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(task.startDate.getTime() + 86400000), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
              
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
      
      <Card>
        <CardHeader>
          <CardTitle>Related Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Team Context</h3>
              <p className="text-sm text-muted-foreground">
                This task is part of the {task.team} team's 2025 roadmap initiatives.
                {task.team === "Tech Trading" && " Focused on enhancing trading capabilities and reliability."}
                {task.team === "Tech Custody & Banking" && " Working on secure banking integrations and services."}
                {task.team === "Tech PMS" && " Building advanced portfolio management systems."}
                {task.team === "Tech Execution" && " Improving trade execution reliability and performance."}
                {task.team === "Tech Infrastructure" && " Enhancing platform stability and security."}
                {task.team === "Business Operations" && " Streamlining business processes and tools."}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Dependencies</h3>
              {task.team === "Tech Trading" && task.title === "Delayed Settlement" ? (
                <p className="text-sm">This task depends on the "Delayed Settlement Account" task from Tech PMS team.</p>
              ) : task.team === "Tech PMS" && task.title === "Delayed Settlement Account" ? (
                <p className="text-sm">The "Delayed Settlement" task from Tech Trading team depends on this task.</p>
              ) : (
                <p className="text-sm text-muted-foreground">No critical dependencies identified for this task.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-4">
          <div className="flex justify-end w-full">
            <Button 
              variant="outline" 
              onClick={() => navigate("/roadmap")}
            >
              Back to Roadmap
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
