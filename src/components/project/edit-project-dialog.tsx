
import { useState, useEffect, useMemo } from "react";
import { useProjects } from "@/context/project-context";
import { Project, ProjectPhase } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, X, MessageCircle, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";
import { toast } from "@/components/ui/use-toast";
import { ProjectForm } from "./project-form";
import { RoadmapSettings } from "./roadmap-settings";
import { ProjectFormValues } from "./types/project-form";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { TeamMember } from "@/components/team/types/team-member";

type EditProjectDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
};

export function EditProjectDialog({ open, setOpen, project }: EditProjectDialogProps) {
  const { updateProject } = useProjects();
  const [isRoadmapProject, setIsRoadmapProject] = useState<boolean>(!!project.displayOnRoadmap);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [nextPhase, setNextPhase] = useState<string | null>(null);
  const [availableTeams] = useState<string[]>([
    "Tech Trading", 
    "Tech Custody & Banking", 
    "Tech PMS", 
    "Tech Execution", 
    "Tech Infrastructure", 
    "Business Operations"
  ]);

  const phaseNames = {
    proposal: "Proposal",
    build: "Build",
    release: "Release",
    results: "Results"
  };

  const phases: ProjectPhase[] = ['proposal', 'build', 'release', 'results'];
  const currentPhaseIndex = phases.indexOf(project.currentPhase);
  const nextAvailablePhase = currentPhaseIndex < phases.length - 1 ? phases[currentPhaseIndex + 1] : null;

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
      approvers: project.approvers || [],
      builders: project.builders || [],
    },
  });

  useEffect(() => {
    const loadTeamMembers = async () => {
      if (project.team) {
        try {
          const members = await fetchTeamMembers(project.team);
          setTeamMembers(members);
        } catch (error) {
          console.error('Failed to load team members:', error);
          toast({
            title: "Error",
            description: "Failed to load team members",
            variant: "destructive"
          });
        }
      }
    };
    
    if (open) {
      loadTeamMembers();
    }
  }, [project.team, open]);

  useEffect(() => {
    if (activeTab === "phase" && !nextPhase && project.currentPhase !== 'results') {
      setNextPhase(project.currentPhase);
    }
  }, [activeTab, nextPhase, project.currentPhase]);

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
      approvers: values.approvers || [],
      builders: values.builders || [],
      owner_id: values.owner_id,
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
    
    if (nextPhase && nextPhase !== project.currentPhase) {
      updatedProject.currentPhase = nextPhase as any;
      
      if (!updatedProject.phases[nextPhase]) {
        updatedProject.phases[nextPhase] = {
          status: 'not-started',
          startDate: new Date()
        };
      }
      
      if (updatedProject.phases[project.currentPhase]) {
        updatedProject.phases[project.currentPhase] = {
          ...updatedProject.phases[project.currentPhase],
          status: 'completed',
          endDate: new Date()
        };
      }
      
      updatedProject.phases[nextPhase] = {
        ...updatedProject.phases[nextPhase],
        status: 'in-progress',
        startDate: new Date()
      };
      
      const transitionComment = `Moved project from ${phaseNames[project.currentPhase]} to ${phaseNames[nextPhase]} phase`;
      if (!values.comment) {
        values.comment = transitionComment;
      }
    }
    
    updateProject(updatedProject, values.comment.trim());
    toast({
      title: "Project updated",
      description: nextPhase && nextPhase !== project.currentPhase 
        ? `Project moved to ${phaseNames[nextPhase]} phase successfully.` 
        : "Your project has been updated successfully.",
    });
    
    setOpen(false);
    setNextPhase(null);
  };

  const teamMemberOptions = useMemo(() => 
    teamMembers.map(member => ({
      value: member.id,
      label: `${member.name} (${member.role})`
    })), 
    [teamMembers]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="phase">
              Phase Management
              <PhaseBadge phase={project.currentPhase} size="sm" className="ml-2" />
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <TabsContent value="general">
                <ProjectForm 
                  form={form}
                  teamMembers={teamMembers}
                  availableTeams={availableTeams}
                  isRoadmapProject={isRoadmapProject}
                  onRoadmapToggle={setIsRoadmapProject}
                  showPhaseAssignees={true}
                />
                
                {isRoadmapProject && <RoadmapSettings control={form.control} />}
              </TabsContent>
              
              <TabsContent value="phase" className="space-y-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Project Phase Management</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Current phase:</span>
                    <PhaseBadge phase={project.currentPhase} size="md" />
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Transition to Next Phase</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Moving to the next phase will mark the current phase as complete and start the new phase.
                    </p>
                    
                    {project.currentPhase !== 'results' && (
                      <div className="flex items-center gap-3">
                        <PhaseBadge phase={project.currentPhase} size="sm" />
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={nextPhase || ""} 
                          onValueChange={(value) => setNextPhase(value as ProjectPhase)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select next phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {phases.map((phase) => (
                              <SelectItem 
                                key={phase} 
                                value={phase}
                                disabled={phases.indexOf(phase) <= phases.indexOf(project.currentPhase)}
                              >
                                {phase.charAt(0).toUpperCase() + phase.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {project.currentPhase === 'results' && (
                      <p className="text-amber-500">
                        This project is in the final phase and cannot be advanced further.
                      </p>
                    )}
                  </div>
                  
                  {nextPhase === 'build' && (
                    <div className="bg-muted/40 p-4 rounded-md border border-muted">
                      <h4 className="font-medium mb-2">Build Phase Requirements</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Before moving to the build phase, please assign team members who will be responsible for implementation.
                      </p>
                      
                      <FormField
                        control={form.control}
                        name="builders"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assign Developers for Build Phase</FormLabel>
                            <MultiSelect
                              value={field.value || []}
                              onChange={field.onChange}
                              options={teamMemberOptions}
                              placeholder="Select developers"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="font-medium">Team Member Assignments</h4>
                  <ProjectForm 
                    form={form}
                    teamMembers={teamMembers}
                    availableTeams={availableTeams}
                    isRoadmapProject={isRoadmapProject}
                    onRoadmapToggle={setIsRoadmapProject}
                    showPhaseAssignees={true}
                  />
                </div>
              </TabsContent>
              
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
                          placeholder={
                            nextPhase && nextPhase !== project.currentPhase
                              ? `Moving from ${phaseNames[project.currentPhase]} to ${phaseNames[nextPhase]} phase`
                              : "What changes are you making and why?"
                          } 
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
