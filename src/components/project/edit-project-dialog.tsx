import { useState, useEffect } from "react";
import { useProjects } from "@/context/project-context";
import { Project, ProjectPhase, TaskCategory } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, X, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";

type EditProjectDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
};

type ProjectFormValues = {
  title: string;
  description: string;
  team: string;
  owner: string;
  tags: string;
  displayOnRoadmap: boolean;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  comment: string;
  owner_id: string;
};

export function EditProjectDialog({ open, setOpen, project }: EditProjectDialogProps) {
  const { updateProject } = useProjects();
  const [isRoadmapProject, setIsRoadmapProject] = useState<boolean>(!!project.displayOnRoadmap);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadTeamMembers = async () => {
      if (project.team) {
        const members = await fetchTeamMembers(project.team);
        setTeamMembers(members);
      }
    };
    loadTeamMembers();
  }, [project.team]);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: project.title,
      description: project.description,
      team: project.team,
      owner: project.owner,
      tags: project.tags.join(", "),
      displayOnRoadmap: !!project.displayOnRoadmap,
      startDate: project.startDate ? project.startDate.toISOString().split("T")[0] : undefined,
      endDate: project.endDate ? project.endDate.toISOString().split("T")[0] : undefined,
      status: project.status,
      category: project.category,
      comment: "",
      owner_id: project.owner_id || "",
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
      
    const updatedProject: Project = {
      ...project,
      title: values.title,
      description: values.description,
      team: values.team,
      owner: values.owner,
      tags,
      displayOnRoadmap: isRoadmapProject,
      updatedAt: new Date(),
    };
    
    if (isRoadmapProject) {
      if (values.startDate) {
        updatedProject.startDate = new Date(values.startDate);
      }
      if (values.endDate) {
        updatedProject.endDate = new Date(values.endDate);
      }
      if (values.status) {
        updatedProject.status = values.status as any;
      }
      if (values.category) {
        updatedProject.category = values.category as TaskCategory;
      }
    } else {
      delete updatedProject.startDate;
      delete updatedProject.endDate;
      delete updatedProject.status;
      delete updatedProject.category;
      delete updatedProject.displayOnRoadmap;
    }
    
    updateProject(updatedProject, values.comment.trim());
    toast({
      title: "Project updated",
      description: "Your project has been updated successfully.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('owner_id', '');
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="owner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Owner</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                checked={isRoadmapProject} 
                onCheckedChange={setIsRoadmapProject}
                id="roadmap-switch"
              />
              <label
                htmlFor="roadmap-switch"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Display on Roadmap
              </label>
            </div>
            
            {isRoadmapProject && (
              <div className="space-y-4 border rounded-md p-4 bg-muted/10">
                <h3 className="text-sm font-medium">Roadmap Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="feature">Feature</SelectItem>
                            <SelectItem value="bugfix">Bug Fix</SelectItem>
                            <SelectItem value="improvement">Improvement</SelectItem>
                            <SelectItem value="refactor">Refactor</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="documentation">Documentation</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <Separator />
            <div className="pt-2">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Comment about this change (will show in history)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What changes are you making and why?" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
