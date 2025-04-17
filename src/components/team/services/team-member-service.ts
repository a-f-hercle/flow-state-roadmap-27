
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "../types/team-member";

/**
 * Helper function to derive a display name from an email
 */
export const getDisplayNameFromEmail = (email: string): string => {
  if (!email) return "Unknown User";
  
  // Extract the part before the @ symbol
  const namePart = email.split('@')[0];
  
  // Convert to title case (capitalize first letter of each word)
  return namePart
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Maps database record to TeamMember interface with derived displayName
 */
export const mapDbRecordToTeamMember = (record: any): TeamMember => {
  return {
    id: record.id,
    email: record.email || '',
    role: record.role || '',
    team_name: record.team_name,
    avatar_url: record.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(record.email || 'User')}`,
    user_id: record.user_id,
    invited: record.invited ?? true,
    created_at: record.created_at,
    updated_at: record.updated_at,
    displayName: getDisplayNameFromEmail(record.email)
  };
};

/**
 * Add a new team member
 */
export const addTeamMember = async (
  teamName: string,
  data: { email: string; role: string },
  bypassAuth: boolean
): Promise<TeamMember> => {
  // First check if member already exists in this team
  const { data: existingMember, error: checkError } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_name', teamName)
    .eq('email', data.email)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking for existing team member:", checkError);
    throw new Error("Failed to check for existing team member");
  }
  
  if (existingMember) {
    throw new Error(`${data.email} is already a member of the ${teamName} team`);
  }
  
  let memberId: string | undefined;
  const displayName = getDisplayNameFromEmail(data.email);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
  
  if (bypassAuth) {
    const { data: newMemberId, error } = await supabase
      .rpc('add_team_member_bypass', {
        p_team_name: teamName,
        p_role: data.role,
        p_email: data.email,
        p_name: displayName, // This will be stored in metadata
        p_avatar_url: avatarUrl
      });
      
    if (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
    
    if (!newMemberId) {
      throw new Error("Failed to get member ID from RPC function");
    }
    
    memberId = newMemberId;
  } else {
    const { data: newMember, error } = await supabase
      .from('team_members')
      .insert({
        team_name: teamName,
        role: data.role,
        email: data.email,
        invited: true,
        avatar_url: avatarUrl,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    memberId = newMember.id;
  }
  
  if (!memberId) {
    throw new Error("Failed to get member ID");
  }
  
  const { data: memberData, error: fetchError } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', memberId)
    .single();
  
  if (fetchError) {
    console.error("Error fetching new team member:", fetchError);
    throw fetchError;
  }
  
  if (!memberData) {
    throw new Error("Failed to fetch newly created member");
  }
  
  return mapDbRecordToTeamMember(memberData);
};

/**
 * Fetch team members for a specific team
 */
export const fetchTeamMembers = async (teamName: string): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_name', teamName);
    
  if (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
  
  return data.map(mapDbRecordToTeamMember);
};

/**
 * Remove a team member
 */
export const removeTeamMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);
    
  if (error) {
    console.error("Error removing team member:", error);
    throw error;
  }
};
