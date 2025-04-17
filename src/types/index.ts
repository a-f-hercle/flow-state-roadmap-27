
export type ProjectPhase = 'proposal' | 'build' | 'release' | 'results';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type Reviewer = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

export type Review = {
  id: string;
  type: 'OK1' | 'OK2';
  reviewers: {
    id: string;
    status: ReviewStatus;
    feedback?: string;
    timestamp?: Date;
  }[];
};

export type HistoryAction = 'created' | 'updated' | 'phase-change' | 'timeline-change' | 'characteristic-change';

export type HistoryEntry = {
  id: string;
  timestamp: Date;
  action: HistoryAction;
  user: string;
  comment?: string; // Added comment field for user comments
  details: {
    field?: string;
    previousValue?: any;
    newValue?: any;
    description?: string;
  };
};

export type Project = {
  id: string;
  title: string;
  description: string;
  team: string;
  owner: string;
  currentPhase: ProjectPhase;
  phases: {
    [key in ProjectPhase]?: {
      startDate?: Date;
      endDate?: Date;
      status: 'not-started' | 'in-progress' | 'completed';
      notes?: string;
      review?: Review;
    };
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Roadmap specific fields
  startDate?: Date;
  endDate?: Date;
  status?: 'planned' | 'in-progress' | 'completed' | 'blocked';
  category?: TaskCategory;
  displayOnRoadmap?: boolean;
  // History tracking
  history?: HistoryEntry[];
};

export type TaskCategory = 'feature' | 'bugfix' | 'improvement' | 'refactor' | 'infrastructure' | 'documentation' | 'compliance' | 'security';

export type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'blocked';

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  team: string;
  assignee?: string;
  projectId?: string;
  color?: string;
};
