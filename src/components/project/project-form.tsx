
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./types/project-form";
import { TeamMember } from "../team/types/team-member";

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  teamMembers: TeamMember[];
  availableTeams: string[];
  isRoadmapProject: boolean;
  onRoadmapToggle: (checked: boolean) => void;
}

export function ProjectForm({ 
  form, 
  teamMembers, 
  availableTeams, 
  isRoadmapProject, 
  onRoadmapToggle 
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
