
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { TeamMember } from "./team-member-list";
import { AddMemberForm } from "./add-member-form";
import { AddMemberFormValues } from "./schemas/member-form-schema";
import { addTeamMember } from "./services/team-member-service";

interface AddMemberSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

export const AddMemberSheet = ({
  isOpen,
  onOpenChange,
  teamName,
  setTeamMembers,
}: AddMemberSheetProps) => {
  const { bypassAuth } = useAuth();

  const onAddMemberSubmit = async (data: AddMemberFormValues) => {
    if (!teamName) return;
    
    try {
      const newTeamMember = await addTeamMember(teamName, data, bypassAuth);
      
      setTeamMembers(prev => [...prev, newTeamMember]);
      onOpenChange(false);
      
      sonnerToast("Member invited", {
        description: `${data.email} has been invited to the ${teamName} team`,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      sonnerToast("Failed to add member", {
        description: "Please try again later",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Team Member</SheetTitle>
          <SheetDescription>
            Add a new member to the {teamName} team by email address.
          </SheetDescription>
        </SheetHeader>
        
        <AddMemberForm
          onSubmit={onAddMemberSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
};
