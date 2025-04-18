
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { useProjects } from "@/context/project-context";
import { ProjectFormValues } from "@/components/project/types/project-form";
import { TaskCategory, TaskStatus } from "@/types";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/team/types/team-member";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type NewProjectFormProps = {
  onSubmit: (values: ProjectFormValues) => void;
};

export function NewProjectForm({ onSubmit }: NewProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      team: "",
      owner: "",
      owner_id: "",
      tags: "",
      displayOnRoadmap: false,
      startDate: "",
      endDate: "",
      status: undefined,
      category: undefined,
      comment: "",
      approvers: [],
      builders: [],
    },
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // Status options
  const statusOptions = [
    { label: "Planned", value: "planned" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Blocked", value: "blocked" }
  ];

  // Category options
  const categoryOptions = [
    { label: "Feature", value: "feature" },
    { label: "Bug Fix", value: "bugfix" },
    { label: "Improvement", value: "improvement" },
    { label: "Refactor", value: "refactor" },
    { label: "Infrastructure", value: "infrastructure" },
    { label: "Documentation", value: "documentation" },
    { label: "Compliance", value: "compliance" },
    { label: "Security", value: "security" }
  ];

  // Team options - simplified for demo
  const teamOptions = [
    { id: "eng", name: "Engineering" },
    { id: "design", name: "Design" },
    { id: "product", name: "Product" },
    { id: "marketing", name: "Marketing" }
  ];

  // Load team members when team changes
  useEffect(() => {
    async function loadTeamMembers() {
      if (selectedTeam) {
        try {
          const members = await fetchTeamMembers(selectedTeam);
          setTeamMembers(members);
        } catch (error) {
          console.error("Failed to fetch team members:", error);
        }
      } else {
        setTeamMembers([]);
      }
    }

    loadTeamMembers();
  }, [selectedTeam]);

  // Convert team members to options for MultiSelect
  const teamMemberOptions = teamMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    form.setValue("team", teamId);
  };

  const handleFormSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
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
                    <Textarea 
                      placeholder="Describe the project purpose and goals" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
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
                      onValueChange={handleTeamChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamOptions.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
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
                    <FormLabel>Owner</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const owner = teamMembers.find(member => member.id === value);
                        form.setValue("owner", owner ? owner.name : "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
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
              name="approvers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Approvers</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={teamMemberOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select approvers for this project"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="builders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Phase Team Members</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={teamMemberOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select developers for the build phase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter comma-separated tags" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayOnRoadmap"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display on Roadmap</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Show this project on the company roadmap
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("displayOnRoadmap") && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-md font-medium">Roadmap Details</h3>
                
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
                          onValueChange={(value) => {
                            field.onChange(value as TaskStatus);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value as TaskCategory);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 border-t p-4">
            <Button type="submit">Create Project</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
