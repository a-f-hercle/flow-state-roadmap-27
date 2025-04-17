
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { TeamMember } from "./team-member-list";
import { AddMemberForm } from "./add-member-form";
import { AddMemberFormValues } from "./schemas/member-form-schema";
import { addTeamMember } from "./services/team-member-service";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onAddMemberSubmit = async (data: AddMemberFormValues) => {
    if (!teamName) return;
    
    setIsSubmitting(true);
    
    try {
      const newTeamMember = await addTeamMember(teamName, data, bypassAuth);
      
      setTeamMembers(prev => [...prev, newTeamMember]);
      onOpenChange(false);
      
      sonnerToast("Member added successfully", {
        description: `${data.email} has been added to the ${teamName} team`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      
      // Display a more user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred. Please try again.";
        
      sonnerToast("Failed to add member", {
        description: errorMessage,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  );
};
