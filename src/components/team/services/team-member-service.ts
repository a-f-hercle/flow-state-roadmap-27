
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

/**
 * Mock implementation - no longer needs database access
 */
export const fetchTeamMembers = async (teamName: string): Promise<TeamMember[]> => {
  // This would typically return stored team members
  // For now, it returns an empty array since we're starting fresh
  return [];
};

/**
 * Mock implementation - no longer needs database access
 */
export const removeTeamMember = async (memberId: string): Promise<void> => {
  // No database action needed
  return;
};
