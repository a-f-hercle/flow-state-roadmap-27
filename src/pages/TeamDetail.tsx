
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import { mockReviewers } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/context/project-context";
import { ProjectCard } from "@/components/project/project-card";
import { UsersRound, Plus, UserPlus2, X } from "lucide-react";
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

// Define the form schema
const addMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  avatar: z.string().optional(),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const { projects } = useProjects();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState(
    // Get team members from mockReviewers
    mockReviewers.filter(member => 
      // This is a simplified way to match team members - in a real app you'd have a more robust relationship
      Math.random() > 0.5
    ).slice(0, 3)
  );

  // Find team projects
  const teamProjects = projects.filter(project => project.team === teamName);
  
  // Count roadmap projects
  const roadmapProjects = teamProjects.filter(p => p.displayOnRoadmap);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      avatar: "",
    },
  });

  const handleManageMembers = () => {
    setIsManageMembersOpen(true);
  };

  const handleAddMember = () => {
    setIsAddMemberOpen(true);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    toast({
      title: "Member removed",
      description: "The team member has been removed successfully",
    });
  };

  const onAddMemberSubmit = (data: AddMemberFormValues) => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: data.name,
      role: data.role,
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
    };

    setTeamMembers(prev => [...prev, newMember]);
    setIsAddMemberOpen(false);
    form.reset();
    
    toast({
      title: "Member added",
      description: `${data.name} has been added to the ${teamName} team`,
    });
  };

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
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
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
            
            {teamMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleRemoveMember(member.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsManageMembersOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Sheet */}
      <Sheet open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Team Member</SheetTitle>
            <SheetDescription>
              Add a new member to the {teamName} team.
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
                      <Input placeholder="Enter name" {...field} />
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
              
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.png" {...field} />
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
