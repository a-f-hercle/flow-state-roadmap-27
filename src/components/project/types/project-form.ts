
export type ProjectFormValues = {
  title: string;
  description: string;
  team: string;
  owner: string;
  tags: string;
  displayOnRoadmap: boolean;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  comment: string;
  owner_id: string;
  approvers?: string[]; // IDs of team members who can approve proposals
  builders?: string[]; // IDs of team members responsible for the build phase
};
