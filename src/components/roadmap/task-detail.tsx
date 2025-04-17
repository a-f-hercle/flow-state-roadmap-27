
import { useNavigate } from "react-router-dom";
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
  AlertCircle,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { TaskCategory } from "@/types";
import { useProjects } from "@/context/project-context";
import { useState } from "react";
import { EditProjectDialog } from "@/components/project/edit-project-dialog";

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

const statusIcons = {
  "completed": CheckCircle2,
  "in-progress": CircleDashed,
  "planned": Circle,
  "blocked": AlertCircle
};

interface TaskDetailProps {
  id?: string;
}

export function TaskDetail({ id }: TaskDetailProps) {
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const project = getProject(id || "");
  
  if (!project || !project.displayOnRoadmap || !project.startDate || !project.endDate) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Project not found or not on roadmap</h2>
        <Button onClick={() => navigate("/roadmap")}>Back to Roadmap</Button>
      </div>
    );
  }
  
  const StatusIcon = project.status 
    ? statusIcons[project.status as keyof typeof statusIcons] 
    : Circle;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/roadmap")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Edit Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`h-5 w-5 ${
                  project.status === 'completed' ? 'text-green-500' : 
                  project.status === 'blocked' ? 'text-red-500' : 
                  project.status === 'in-progress' ? 'text-blue-500' : 'text-amber-500'
                }`} />
                <span>Roadmap Status: <span className="font-medium capitalize">{project.status}</span></span>
              </div>
              {project.category && (
                <Badge className={`${categoryColors[project.category as keyof typeof categoryColors]} text-white`}>
                  {project.category}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Start Date:</span>
                <span className="font-medium">
                  {format(project.startDate, "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">End Date:</span>
                <span className="font-medium">
                  {format(project.endDate, "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Duration:</span>
                <span className="font-medium">
                  {Math.round((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Team:</span>
                <span className="font-medium">{project.team}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Owner:</span>
                <span className="font-medium">{project.owner}</span>
              </div>
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
                  <p className="font-medium">Project Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(project.createdAt, "MMM d, yyyy")}
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
                    {format(project.startDate, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {project.status === 'in-progress' && (
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                    <CircleDashed className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Work Started</p>
                    <p className="text-sm text-muted-foreground">
                      {project.phases.build?.startDate 
                        ? format(project.phases.build.startDate, "MMM d, yyyy")
                        : "Date not recorded"}
                    </p>
                  </div>
                </div>
              )}
              
              {project.status === 'completed' ? (
                <div className="relative pl-10">
                  <div className="absolute left-0 w-8 h-8 bg-background border rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {format(project.endDate, "MMM d, yyyy")}
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
                      {format(project.endDate, "MMM d, yyyy")}
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
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Current Phase</h3>
              <p className="text-sm">
                This project is currently in the <Badge variant="outline">{project.currentPhase}</Badge> phase.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Team Context</h3>
              <p className="text-sm text-muted-foreground">
                This project is part of the {project.team} team's 2025 roadmap initiatives.
                {project.team === "Tech Trading" && " Focused on enhancing trading capabilities and reliability."}
                {project.team === "Tech Custody & Banking" && " Working on secure banking integrations and services."}
                {project.team === "Tech PMS" && " Building advanced portfolio management systems."}
                {project.team === "Tech Execution" && " Improving trade execution reliability and performance."}
                {project.team === "Tech Infrastructure" && " Enhancing platform stability and security."}
                {project.team === "Business Operations" && " Streamlining business processes and tools."}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-4">
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              View Full Project Details
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/roadmap")}
            >
              Back to Roadmap
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <EditProjectDialog 
        open={isEditDialogOpen} 
        setOpen={setIsEditDialogOpen}
        project={project}
      />
    </div>
  );
}
