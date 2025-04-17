
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchTeamMembers } from "./services/team-member-service";

export type TeamMember = {
  id: string;
  name: string; // This is derived from email, not from the database
  role: string;
  avatar?: string;
  email: string;
  user_id?: string;
  invited: boolean;
};

interface TeamMemberListProps {
  teamName: string;
  onAddMember: () => void;
}

export const TeamMemberList = ({ teamName, onAddMember }: TeamMemberListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTeamMembers() {
      if (!teamName) return;
      
      try {
        setIsLoading(true);
        const members = await fetchTeamMembers(teamName);
        setTeamMembers(members);
      } catch (error) {
        console.error("Error loading team members:", error);
        toast({
          title: "Failed to load team members",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTeamMembers();
  }, [teamName, toast]);

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : teamMembers.length > 0 ? (
          teamMembers.map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {member.name}
                  {member.invited && !member.user_id && (
                    <Badge variant="outline" className="ml-2 text-xs">Invited</Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-2">No team members yet</p>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={onAddMember}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </CardContent>
    </Card>
  );
}
