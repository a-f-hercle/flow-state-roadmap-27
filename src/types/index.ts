
export type ProjectPhase = 'proposal' | 'prototype' | 'build' | 'release' | 'results';

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
};
