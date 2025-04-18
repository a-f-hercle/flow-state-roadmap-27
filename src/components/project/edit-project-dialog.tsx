
import { useState, useEffect } from "react";
import { useProjects } from "@/context/project-context";
import { Project } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, X, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";
import { toast } from "@/components/ui/use-toast";
import { ProjectForm } from "./project-form";
import { RoadmapSettings } from "./roadmap-settings";
import { ProjectFormValues } from "./types/project-form";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

type EditProjectDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
};

export function EditProjectDialog({ open, setOpen, project }: EditProjectDialogProps) {
  const { updateProject } = useProjects();
  const [isRoadmapProject, setIsRoadmapProject] = useState<boolean>(!!project.displayOnRoadmap);
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableTeams] = useState<string[]>([
    "Tech Trading", 
    "Tech Custody & Banking", 
    "Tech PMS", 
    "Tech Execution", 
    "Tech Infrastructure", 
    "Business Operations"
  ]);

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

  useEffect(() => {
    const loadTeamMembers = async () => {
      if (project.team) {
        const members = await fetchTeamMembers(project.team);
        setTeamMembers(members);
      }
    };
    loadTeamMembers();
  }, [project.team]);

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
        updatedProject.category = values.category as any;
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
            <ProjectForm 
              form={form}
              teamMembers={teamMembers}
              availableTeams={availableTeams}
              isRoadmapProject={isRoadmapProject}
              onRoadmapToggle={setIsRoadmapProject}
            />
            
            {isRoadmapProject && <RoadmapSettings form={form} />}
            
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
