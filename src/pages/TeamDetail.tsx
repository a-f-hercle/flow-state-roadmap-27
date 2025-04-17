import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/context/project-context";
import { ProjectCard } from "@/components/project/project-card";
import { UsersRound, Plus, UserPlus2, X, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";

const addMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
  user_id?: string;
  invited: boolean;
};

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { bypassAuth } = useAuth();
  
  const teamProjects = projects.filter(project => project.team === teamName);
  
  const roadmapProjects = teamProjects.filter(p => p.displayOnRoadmap);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    },
  });

  useEffect(() => {
    async function loadTeamMembers() {
      if (!teamName) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('team_name', teamName);
          
        if (error) throw error;
        
        const formattedMembers: TeamMember[] = data.map(member => ({
          id: member.id,
          name: member.email?.split('@')[0] || 'Unnamed',
          role: member.role,
          email: member.email || '',
          avatar: member.avatar_url || undefined,
          user_id: member.user_id || undefined,
          invited: member.invited || false,
        }));
        
        setTeamMembers(formattedMembers);
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

  const handleManageMembers = () => {
    setIsManageMembersOpen(true);
  };

  const handleAddMember = () => {
    setIsAddMemberOpen(true);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
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
    }
  };

  const onAddMemberSubmit = async (data: AddMemberFormValues) => {
    if (!teamName) return;
    
    try {
      console.log("Adding team member with data:", data);
      console.log("Team name:", teamName);
      
      let memberId: string;
      
      if (bypassAuth) {
        const { data: newMember, error } = await supabase
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
        
        memberId = newMember;
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
          
        if (error) throw error;
        
        memberId = newMember.id;
      }
      
      const { data: memberData, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newTeamMember: TeamMember = {
        id: memberData.id,
        name: data.name,
        role: memberData.role,
        email: memberData.email || '',
        avatar: memberData.avatar_url || undefined,
        invited: true,
      };
      
      setTeamMembers(prev => [...prev, newTeamMember]);
      setIsAddMemberOpen(false);
      form.reset();
      
      toast({
        title: "Member invited",
        description: `${data.email} has been invited to the ${teamName} team`,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Failed to add member",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (!teamName) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{teamName}</h1>
          <p className="text-muted-foreground">
            Team overview and projects
          </p>
        </div>
        <Button onClick={handleManageMembers}>
          <UsersRound className="mr-2 h-4 w-4" />
          Manage Team Members
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              onClick={handleAddMember}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{teamProjects.length}</p>
                  <p className="text-muted-foreground">Total Projects</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{roadmapProjects.length}</p>
                  <p className="text-muted-foreground">Roadmap Projects</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{teamMembers.length}</p>
                  <p className="text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Team Projects</h2>
            {teamProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No projects found for this team.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
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
              <Button size="sm" variant="outline" onClick={handleAddMember}>
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
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {member.name}
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
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-2">No team members yet</p>
            )}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsManageMembersOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
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
                <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Member</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
