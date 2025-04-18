
import { useProjects } from "@/context/project-context";
import { ProjectFormValues } from "@/components/project/types/project-form";
import { NewProjectForm } from "@/components/project/new-project-form";
import { useNavigate } from "react-router-dom";
import { createProject } from "@/services/projectService";

export default function ProjectNew() {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  
  const handleCreate = (values: ProjectFormValues) => {
    // Use our service to create the project
    const projectData = createProject(values);
    
    // Add the project to the context
    addProject(projectData);
    
    // Navigate to the projects page
    navigate("/projects");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new project.
        </p>
      </div>
      <NewProjectForm onSubmit={handleCreate} />
    </div>
  );
}
