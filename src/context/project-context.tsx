import { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ProjectPhase, Review, ReviewStatus, HistoryAction } from '@/types';
import { mockProjects } from '@/data/mock-data';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project, comment?: string) => void; // Added comment parameter
  updatePhase: (projectId: string, phase: ProjectPhase, data: Partial<Project['phases'][ProjectPhase]>) => void;
  updateReview: (projectId: string, phase: ProjectPhase, reviewerId: string, status: ReviewStatus, feedback?: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(
    mockProjects.map(project => ({
      ...project,
      isDeleted: false, // Add isDeleted flag to all projects
      history: project.history || [
        {
          id: '1',
          timestamp: project.createdAt,
          action: 'created' as HistoryAction,
          user: 'System',
          details: {
            description: 'Project created'
          }
        }
      ]
    }))
  );

  const addHistoryEntry = (
    project: Project,
    action: HistoryAction,
    details: {
      field?: string;
      previousValue?: any;
      newValue?: any;
      description?: string;
    },
    comment?: string // Added comment parameter
  ) => {
    const historyEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      user: 'Current User', // In a real app, this would come from auth context
      comment, // Add comment to the history entry if provided
      details
    };

    return {
      ...project,
      history: [...(project.history || []), historyEntry],
    };
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false, // Initialize new projects as not deleted
      history: [
        {
          id: '1',
          timestamp: now,
          action: 'created',
          user: 'Current User',
          details: {
            description: 'Project created'
          }
        }
      ]
    };

    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject: Project, comment?: string) => { // Added comment parameter
    setProjects(
      projects.map((project) => {
        if (project.id === updatedProject.id) {
          // Track changes for history
          const changedFields: {field: string, previous: any, new: any}[] = [];
          
          // Check for isDeleted status change
          if (project.isDeleted !== updatedProject.isDeleted) {
            changedFields.push({
              field: 'isDeleted',
              previous: project.isDeleted,
              new: updatedProject.isDeleted
            });
          }
          
          // Check timeline changes
          if (project.startDate?.getTime() !== updatedProject.startDate?.getTime()) {
            changedFields.push({
              field: 'startDate',
              previous: project.startDate,
              new: updatedProject.startDate
            });
          }
          
          if (project.endDate?.getTime() !== updatedProject.endDate?.getTime()) {
            changedFields.push({
              field: 'endDate',
              previous: project.endDate,
              new: updatedProject.endDate
            });
          }
          
          // Check other characteristic changes
          if (project.status !== updatedProject.status) {
            changedFields.push({
              field: 'status',
              previous: project.status,
              new: updatedProject.status
            });
          }
          
          if (project.currentPhase !== updatedProject.currentPhase) {
            changedFields.push({
              field: 'currentPhase',
              previous: project.currentPhase,
              new: updatedProject.currentPhase
            });
          }
          
          if (project.title !== updatedProject.title) {
            changedFields.push({
              field: 'title',
              previous: project.title,
              new: updatedProject.title
            });
          }
          
          if (project.description !== updatedProject.description) {
            changedFields.push({
              field: 'description',
              previous: project.description,
              new: updatedProject.description
            });
          }
          
          // Create appropriate history entries
          let projectWithHistory = { ...updatedProject, updatedAt: new Date() };
          
          changedFields.forEach(change => {
            let action: HistoryAction = 'characteristic-change';
            
            // Determine the appropriate action type
            if (change.field === 'isDeleted') {
              action = change.new ? 'deleted' : 'restored';
            } else if (change.field === 'startDate' || change.field === 'endDate') {
              action = 'timeline-change';
            } else if (change.field === 'currentPhase') {
              action = 'phase-change';
            }
            
            projectWithHistory = addHistoryEntry(
              projectWithHistory, 
              action,
              {
                field: change.field,
                previousValue: change.previous,
                newValue: change.new,
                description: action === 'deleted' 
                  ? 'Project moved to trash' 
                  : action === 'restored' 
                  ? 'Project restored from trash' 
                  : `Changed ${change.field} from "${change.previous}" to "${change.new}"`
              },
              comment // Pass the comment to the history entry
            );
          });
          
          // If there are no changes but there's a comment, create a generic updated entry
          if (changedFields.length === 0 && comment) {
            projectWithHistory = addHistoryEntry(
              projectWithHistory,
              'updated',
              {
                description: 'Project details updated'
              },
              comment
            );
          }
          
          return projectWithHistory;
        }
        return project;
      })
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
          
          const nextPhase = data.status === 'completed' 
            ? getNextPhase(phase) 
            : project.currentPhase;
          
          const phaseChanged = nextPhase !== project.currentPhase;
          
          let updatedProject = {
            ...project,
            phases: updatedPhases,
            updatedAt: new Date(),
            currentPhase: nextPhase || project.currentPhase
          };
          
          // Add history for phase status change
          updatedProject = addHistoryEntry(
            updatedProject,
            'updated',
            {
              field: `phases.${phase}.status`,
              previousValue: project.phases[phase]?.status,
              newValue: data.status,
              description: `Updated ${phase} phase status to ${data.status}`
            }
          );
          
          // Add history for phase change if applicable
          if (phaseChanged) {
            updatedProject = addHistoryEntry(
              updatedProject,
              'phase-change',
              {
                field: 'currentPhase',
                previousValue: project.currentPhase,
                newValue: nextPhase,
                description: `Project advanced from ${project.currentPhase} phase to ${nextPhase} phase`
              }
            );
          }
          
          return updatedProject;
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
          const previousStatus = project.phases[phase]?.review?.reviewers.find(
            r => r.id === reviewerId
          )?.status;
          
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

          let updatedProject = {
            ...project,
            phases: updatedPhases,
            updatedAt: new Date(),
          };
          
          // Add history for review update
          updatedProject = addHistoryEntry(
            updatedProject,
            'updated',
            {
              field: `phases.${phase}.review.${reviewerId}`,
              previousValue: previousStatus,
              newValue: status,
              description: `Review for ${phase} phase updated from ${previousStatus || 'pending'} to ${status}` +
                (feedback ? ` with feedback: "${feedback}"` : '')
            }
          );

          return updatedProject;
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
