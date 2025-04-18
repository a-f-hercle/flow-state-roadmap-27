
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./types/project-form";
import { TeamMember } from "../team/types/team-member";
import { MultiSelect } from "@/components/ui/multi-select";

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  teamMembers: TeamMember[];
  availableTeams: string[];
  isRoadmapProject: boolean;
  onRoadmapToggle: (checked: boolean) => void;
  showPhaseAssignees?: boolean;
}

export function ProjectForm({ 
  form, 
  teamMembers, 
  availableTeams, 
  isRoadmapProject, 
  onRoadmapToggle,
  showPhaseAssignees = false 
}: ProjectFormProps) {
  return (
    <div className="space-y-4">
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
                  // Reset approvers and builders when team changes
                  form.setValue('approvers', []);
                  form.setValue('builders', []);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTeams.map((team) => (
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
              <Select value={field.value} onValueChange={field.onChange}>
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
      
      {showPhaseAssignees && (
        <div className="space-y-4 pt-2">
          <div className="border-l-4 border-blue-500 pl-3 py-1">
            <h3 className="font-medium">Phase Assignees</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="approvers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Phase - Approvers</FormLabel>
                  <MultiSelect
                    value={field.value || []}
                    onChange={field.onChange}
                    options={teamMembers.map(member => ({
                      value: member.id,
                      label: member.name
                    }))}
                    placeholder="Select approvers"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="builders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Phase - Assigned Developers</FormLabel>
                  <MultiSelect
                    value={field.value || []}
                    onChange={field.onChange}
                    options={teamMembers.map(member => ({
                      value: member.id,
                      label: member.name
                    }))}
                    placeholder="Select developers"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
      
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
          onCheckedChange={onRoadmapToggle}
          id="roadmap-switch"
        />
        <label
          htmlFor="roadmap-switch"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Display on Roadmap
        </label>
      </div>
    </div>
  );
}
