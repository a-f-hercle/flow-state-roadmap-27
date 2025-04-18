
import { useProjects } from "@/context/project-context";
import { ProjectFormValues } from "@/components/project/types/project-form";
import { NewProjectForm } from "@/components/project/new-project-form";
import { useNavigate } from "react-router-dom";
import { ProjectPhase, Project, Review } from "@/types";
import { mockReviewers } from "@/data/mock-data";

export default function ProjectNew() {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  
  const handleCreate = (values: ProjectFormValues) => {
    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
      
    const now = new Date();
    
    const initialPhase: ProjectPhase = "proposal";
    
    const review: Review = {
      id: Date.now().toString(),
      type: "OK1", // Changed from "OK Review" to "OK1"
      reviewers: mockReviewers.map((reviewer) => ({
        id: reviewer.id,
        status: "pending",
      })),
    };
    
    const phases = {
      [initialPhase]: {
        startDate: now,
        status: "in-progress" as const,
        review,
      },
    };
    
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      title: values.title,
      description: values.description,
      team: values.team,
      owner: values.owner || "Unassigned",
      currentPhase: initialPhase,
      phases,
      tags,
      // Add the new fields
      owner_id: values.owner_id || "",
      approvers: values.approvers || [],
      builders: values.builders || [],
    };
    
    // Add roadmap properties if needed
    if (values.displayOnRoadmap) {
      projectData.displayOnRoadmap = true;
      if (values.startDate) {
        projectData.startDate = new Date(values.startDate);
      }
      if (values.endDate) {
        projectData.endDate = new Date(values.endDate);
      }
      if (values.status) {
        projectData.status = values.status;
      }
      if (values.category) {
        projectData.category = values.category;
      }
    }
    
    addProject(projectData);
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
