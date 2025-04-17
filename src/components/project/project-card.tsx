
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Project } from "@/types";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
          <PhaseBadge phase={project.currentPhase} />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Team:</span>
          <span className="text-sm">{project.team}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Owner:</span>
          <span className="text-sm">{project.owner}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 2}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </span>
      </CardFooter>
    </Card>
  );
}
