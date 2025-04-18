
import { Project, ProjectPhase, Review, TaskStatus, TaskCategory } from "@/types";
import { ProjectFormValues } from "@/components/project/types/project-form";
import { mockReviewers } from "@/data/mock-data";

/**
 * Creates a new project from form values
 */
export const createProject = (values: ProjectFormValues): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> => {
  const tags = values.tags
    ? values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    : [];
    
  const now = new Date();
  
  const initialPhase: ProjectPhase = "proposal";
  
  const review: Review = {
    id: Date.now().toString(),
    type: "OK1", 
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
    description: values.description || "",
    team: values.team,
    owner: values.owner || "Unassigned",
    currentPhase: initialPhase,
    phases,
    tags,
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
      projectData.status = values.status as TaskStatus;
    }
    if (values.category) {
      projectData.category = values.category as TaskCategory;
    }
  }
  
  return projectData;
};
