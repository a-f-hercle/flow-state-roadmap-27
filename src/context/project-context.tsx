import { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ProjectPhase, Review, ReviewStatus } from '@/types';
import { mockProjects } from '@/data/mock-data';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project) => void;
  updatePhase: (projectId: string, phase: ProjectPhase, data: Partial<Project['phases'][ProjectPhase]>) => void;
  updateReview: (projectId: string, phase: ProjectPhase, reviewerId: string, status: ReviewStatus, feedback?: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id
          ? { ...updatedProject, updatedAt: new Date() }
          : project
      )
    );
  };

  const updatePhase = (
    projectId: string,
    phase: ProjectPhase,
    data: Partial<Project['phases'][ProjectPhase]>
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const updatedPhases = {
            ...project.phases,
            [phase]: {
              ...project.phases[phase],
              ...data,
            },
          };
          
          return {
            ...project,
            phases: updatedPhases,
            updatedAt: new Date(),
            // Update currentPhase if the status of this phase is 'completed'
            currentPhase: data.status === 'completed' 
              ? getNextPhase(phase) || project.currentPhase 
              : project.currentPhase
          };
        }
        return project;
      })
    );
  };

  const updateReview = (
    projectId: string,
    phase: ProjectPhase,
    reviewerId: string,
    status: ReviewStatus,
    feedback?: string
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId && project.phases[phase]?.review) {
          const updatedReviewers = project.phases[phase]?.review?.reviewers.map(
            (reviewer) =>
              reviewer.id === reviewerId
                ? {
                    ...reviewer,
                    status,
                    feedback,
                    timestamp: new Date(),
                  }
                : reviewer
          );

          const updatedPhases = {
            ...project.phases,
            [phase]: {
              ...project.phases[phase],
              review: {
                ...(project.phases[phase]?.review as Review),
                reviewers: updatedReviewers,
              },
            },
          };

          return {
            ...project,
            phases: updatedPhases,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const getNextPhase = (currentPhase: ProjectPhase): ProjectPhase | undefined => {
    const phases: ProjectPhase[] = ['proposal', 'build', 'release', 'results'];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      return phases[currentIndex + 1];
    }
    return undefined;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        updatePhase,
        updateReview,
        getProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
