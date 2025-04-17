
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Mail, UserPlus2, X } from "lucide-react";
import { TeamMember } from "./types/team-member";
import { useToast } from "@/hooks/use-toast";
import { removeTeamMember } from "./services/team-member-service";

interface ManageMembersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  onAddMember: () => void;
  isLoading: boolean;
}

export const ManageMembersDialog = ({
  isOpen,
  onOpenChange,
  teamName,
  teamMembers,
  setTeamMembers,
  onAddMember,
  isLoading,
}: ManageMembersDialogProps) => {
  const { toast } = useToast();
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const handleRemoveMember = async (memberId: string) => {
    try {
      setRemovingMemberId(memberId);
      
      await removeTeamMember(memberId);
      
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: "Member removed",
        description: "The team member has been removed successfully",
      });
    } catch (error) {
      console.error("Error removing team member:", error);
      toast({
        title: "Failed to remove member",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Team Members</DialogTitle>
          <DialogDescription>
            Add or remove members from the {teamName} team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-medium">Current Members</h3>
            <Button size="sm" variant="outline" onClick={onAddMember}>
              <UserPlus2 className="h-4 w-4 mr-1" /> Add Member
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : teamMembers.length > 0 ? (
            teamMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url} alt={member.displayName} />
                    <AvatarFallback>{member.displayName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {member.displayName}
                      {member.invited && !member.user_id && (
                        <Badge variant="outline" className="ml-2 text-xs">Invited</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {member.invited && !member.user_id && (
                    <Button size="icon" variant="ghost" className="text-blue-500">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-500"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removingMemberId === member.id}
                  >
                    {removingMemberId === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-2">No team members yet</p>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
