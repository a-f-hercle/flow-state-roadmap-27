
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "../team-member-list";
import { AddMemberFormValues } from "../schemas/member-form-schema";

export const addTeamMember = async (
  teamName: string,
  data: AddMemberFormValues,
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
  
  if (bypassAuth) {
    const { data: newMemberId, error } = await supabase
      .rpc('add_team_member_bypass', {
        p_team_name: teamName,
        p_role: data.role,
        p_email: data.email,
        p_name: data.name,
        p_avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`
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
        name: data.name,
        invited: true,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
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
  
  return {
    id: memberData.id,
    name: data.name || memberData.name || '',
    role: memberData.role,
    email: memberData.email || '',
    avatar: memberData.avatar_url || undefined,
    invited: true,
  };
};
