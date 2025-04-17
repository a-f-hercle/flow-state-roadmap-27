
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { CheckCircle } from "lucide-react";
import { TeamMember } from "./types/team-member";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onAddMemberSubmit = async (data: AddMemberFormValues) => {
    if (!teamName) return;
    
    setIsSubmitting(true);
    
    try {
      const newTeamMember = await addTeamMember(teamName, data);
      
      setTeamMembers(prev => [...prev, newTeamMember]);
      onOpenChange(false);
      
      sonnerToast("Member added successfully", {
        description: `${data.name} has been added to the ${teamName} team`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
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
            Add a new member to the {teamName} team.
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
