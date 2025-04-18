import { TeamMember } from "../types/team-member";

/**
 * Add a new team member (now works locally without database)
 */
export const addTeamMember = async (
  teamName: string,
  data: { name: string; role: string }
): Promise<TeamMember> => {
  // Generate a random ID (previously done by the database)
  const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Create avatar URL using UI avatars service
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`;
  
  // Create new team member object
  const newMember: TeamMember = {
    id: randomId,
    name: data.name,
    role: data.role,
    team_name: teamName,
    avatar_url: avatarUrl
  };
  
  return newMember;
};

/**
 * Extract a display name from an email address
 */
export const getDisplayNameFromEmail = (email: string): string => {
  if (!email || email === "") return "User";
  
  // Get part before @ symbol
  const namePart = email.split("@")[0];
  
  // Convert dots and underscores to spaces
  const nameWithSpaces = namePart.replace(/[._]/g, " ");
  
  // Capitalize each word
  return nameWithSpaces
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Initial team members data
const initialTeamMembers: TeamMember[] = [
  {
    id: "marco-1",
    name: "Marco Levarato",
    role: "Head of Tech Trading & Infrastructure",
    team_name: "Tech Trading",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Marco Levarato")}`
  },
  {
    id: "marco-2",
    name: "Marco Levarato",
    role: "Head of Tech Trading & Infrastructure",
    team_name: "Tech Infrastructure",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Marco Levarato")}`
  },
  {
    id: "massimo-1",
    name: "Massimo Mannoni",
    role: "Head of Banking & Trading Systems",
    team_name: "Tech Custody & Banking",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Massimo Mannoni")}`
  },
  {
    id: "massimo-2",
    name: "Massimo Mannoni",
    role: "Head of Banking & Trading Systems",
    team_name: "Tech PMS",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Massimo Mannoni")}`
  },
  {
    id: "massimo-3",
    name: "Massimo Mannoni",
    role: "Head of Banking & Trading Systems",
    team_name: "Tech Execution",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Massimo Mannoni")}`
  },
  {
    id: "andrea-1",
    name: "Andrea Petrolati",
    role: "Head of Business Operations",
    team_name: "Business Operations",
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent("Andrea Petrolati")}`
  }
];

/**
 * Mock implementation - returns pre-loaded team members for the specified team
 */
export const fetchTeamMembers = async (teamName: string): Promise<TeamMember[]> => {
  // This is mock data for now
  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Senior Developer',
      team_name: teamName,
      email: 'john.doe@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Product Manager',
      team_name: teamName,
      email: 'jane.smith@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=2'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Tech Lead',
      team_name: teamName,
      email: 'mike.johnson@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=3'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      role: 'Developer',
      team_name: teamName,
      email: 'sarah.wilson@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=4'
    },
    {
      id: '5',
      name: 'David Brown',
      role: 'QA Engineer',
      team_name: teamName,
      email: 'david.brown@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=5'
    },
    {
      id: '6',
      name: 'Emily Taylor',
      role: 'Designer',
      team_name: teamName,
      email: 'emily.taylor@example.com',
      avatar_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=6'
    },
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockTeamMembers;
};

/**
 * Mock implementation - no longer needs database access
 */
export const removeTeamMember = async (memberId: string): Promise<void> => {
  // No database action needed
  return;
};
