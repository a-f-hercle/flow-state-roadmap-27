
import React from "react";
import { Card } from "@/components/ui/card";
import { ProjectCard } from "@/components/project/project-card";

interface TeamProjectsProps {
  teamProjects: any[];
}

export const TeamProjects = ({ teamProjects }: TeamProjectsProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Projects</h2>
      {teamProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No projects found for this team.</p>
        </Card>
      )}
    </div>
  );
};
