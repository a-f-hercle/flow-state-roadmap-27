
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { TeamMember } from "./team-member-list";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { AlertTriangle } from "lucide-react";

const addMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

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
  const { toast } = useToast();
  const { bypassAuth } = useAuth();
  
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    },
  });

  const onAddMemberSubmit = async (data: AddMemberFormValues) => {
    if (!teamName) return;
    
    try {
      // Check if member with same email already exists
      const { data: existingMember, error: existingError } = await supabase
        .from('team_members')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();

      if (existingError) {
        console.error("Error checking existing members:", existingError);
      }
      
      // If member already exists with this email, show error and return
      if (existingMember) {
        form.setError("email", { 
          type: "manual", 
          message: "A member with this email already exists" 
        });
        
        sonnerToast("Member already exists", {
          description: "A team member with this email address already exists",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        });
        
        return;
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
          
          // Handle duplicate key error specifically
          if (error.code === '23505') {
            form.setError("email", { 
              type: "manual", 
              message: "A member with this email already exists" 
            });
            
            sonnerToast("Member already exists", {
              description: "A team member with this email address already exists",
              icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            });
            
            return;
          }
          
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
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
          })
          .select()
          .single();
          
        if (error) {
          // Handle duplicate key error specifically
          if (error.code === '23505') {
            form.setError("email", { 
              type: "manual", 
              message: "A member with this email already exists" 
            });
            
            sonnerToast("Member already exists", {
              description: "A team member with this email address already exists",
              icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            });
            
            return;
          }
          
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
      
      const newTeamMember: TeamMember = {
        id: memberData.id,
        name: data.name,
        role: memberData.role,
        email: memberData.email || '',
        avatar: memberData.avatar_url || undefined,
        invited: true,
      };
      
      setTeamMembers(prev => [...prev, newTeamMember]);
      onOpenChange(false);
      form.reset();
      
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAddMemberSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="team.member@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
