
import { ProjectList } from "@/components/project/project-list";

export default function Projects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track the status of all your team's projects
        </p>
      </div>
      
      <ProjectList />
    </div>
  );
}
