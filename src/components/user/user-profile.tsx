
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom"; 
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  team: string | null;
  role: string | null;
};

type TeamInvite = {
  id: string;
  team_name: string;
  role: string;
  email: string;
  name?: string;
};

type TeamMember = {
  id: string;
  team_name: string;
  role: string;
  name?: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [teamMemberships, setTeamMemberships] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvitesLoading, setIsInvitesLoading] = useState(true);
  const [isMembershipsLoading, setIsMembershipsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFormData({
          full_name: data.full_name || user.user_metadata?.full_name,
          team: data.team,
          role: data.role,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function checkTeamInvites() {
      if (!user?.email) return;
      
      try {
        setIsInvitesLoading(true);
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("email", user.email)
          .is("user_id", null)
          .eq("invited", true);
          
        if (error) throw error;
        
        setTeamInvites(data as TeamInvite[]);
      } catch (error) {
        console.error("Error checking team invites:", error);
      } finally {
        setIsInvitesLoading(false);
      }
    }

    async function fetchTeamMemberships() {
      if (!user) return;
      
      try {
        setIsMembershipsLoading(true);
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("user_id", user.id)
          .eq("invited", false);
          
        if (error) throw error;
        
        setTeamMemberships(data as TeamMember[]);
      } catch (error) {
        console.error("Error fetching team memberships:", error);
      } finally {
        setIsMembershipsLoading(false);
      }
    }

    fetchProfile();
    checkTeamInvites();
    fetchTeamMemberships();
  }, [user]);

  async function updateProfile() {
    if (!user || !profile) return;

    try {
      setIsUpdating(true);

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      // Update local profile state
      setProfile({
        ...profile,
        ...updates as Profile,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function acceptTeamInvite(inviteId: string, teamName: string) {
    if (!user) return;
    
    try {
      setIsInvitesLoading(true);
      
      // Update team_members record to link with user
      const { data, error } = await supabase
        .from("team_members")
        .update({
          user_id: user.id,
          invited: false,
        })
        .eq("id", inviteId)
        .select();
        
      if (error) throw error;
      
      // Remove accepted invite from local state
      setTeamInvites(prev => prev.filter(invite => invite.id !== inviteId));
      
      // Add to team memberships
      if (data && data.length > 0) {
        setTeamMemberships(prev => [...prev, data[0] as TeamMember]);
      }
      
      toast({
        title: "Team invite accepted",
        description: `You have joined the ${teamName} team`,
      });
    } catch (error) {
      console.error("Error accepting team invite:", error);
      toast({
        title: "Failed to join team",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsInvitesLoading(false);
    }
  }
  
  async function declineTeamInvite(inviteId: string, teamName: string) {
    try {
      setIsInvitesLoading(true);
      
      // Delete the team_members record
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", inviteId);
        
      if (error) throw error;
      
      // Remove declined invite from local state
      setTeamInvites(prev => prev.filter(invite => invite.id !== inviteId));
      
      toast({
        title: "Team invite declined",
        description: `You have declined to join the ${teamName} team`,
      });
    } catch (error) {
      console.error("Error declining team invite:", error);
      toast({
        title: "Failed to decline invite",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsInvitesLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Team Invitations Section */}
      {teamInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Invitations</CardTitle>
            <CardDescription>
              You have been invited to join the following teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isInvitesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full"></div>
                </div>
              ) : (
                teamInvites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{invite.team_name}</h3>
                      <p className="text-sm text-muted-foreground">Role: {invite.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => acceptTeamInvite(invite.id, invite.team_name)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => declineTeamInvite(invite.id, invite.team_name)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Memberships Section */}
      {teamMemberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
            <CardDescription>
              Teams that you are currently a member of
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isMembershipsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full"></div>
                </div>
              ) : (
                teamMemberships.map(membership => (
                  <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{membership.team_name}</h3>
                      <p className="text-sm text-muted-foreground">Role: {membership.role}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/teams/${membership.team_name}`)}
                    >
                      View Team
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and edit your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.user_metadata?.avatar_url || profile?.avatar_url || undefined} alt={profile?.full_name || ""} />
              <AvatarFallback className="text-xl">
                {(profile?.full_name || user.user_metadata?.full_name || user.email || "User")
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.full_name || ""}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team">Default Team</Label>
              <Select 
                value={formData.team || ""} 
                onValueChange={(value) => setFormData({ ...formData, team: value })}
              >
                <SelectTrigger id="team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Trading">Tech Trading</SelectItem>
                  <SelectItem value="Tech Custody & Banking">Tech Custody & Banking</SelectItem>
                  <SelectItem value="Tech PMS">Tech PMS</SelectItem>
                  <SelectItem value="Tech Execution">Tech Execution</SelectItem>
                  <SelectItem value="Tech Infrastructure">Tech Infrastructure</SelectItem>
                  <SelectItem value="Business Operations">Business Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Primary Role</Label>
              <Select 
                value={formData.role || ""} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={updateProfile} 
            disabled={isUpdating}
            className="ml-auto"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
