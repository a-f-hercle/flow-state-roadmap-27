
export interface TeamMember {
  id: string;
  email: string;
  role: string;
  team_name: string;
  avatar_url?: string;
  user_id?: string;
  invited: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Derived property for display purposes
  displayName: string;
}
