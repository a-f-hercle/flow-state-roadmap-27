
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectFormSchema } from "./schemas/project-form-schema";
import { ProjectFormValues } from "./types/project-form";
import { RoadmapSettings } from "./roadmap-settings";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { TeamMember } from "../team/types/team-member";
import { fetchAllUsers } from "../team/services/team-member-service";

export function NewProjectForm({
  onSubmit,
}: {
  onSubmit: (values: ProjectFormValues) => void;
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      team: "Tech Trading",
      owner: "",
      tags: "",
      displayOnRoadmap: false,
      startDate: undefined,
      endDate: undefined,
      status: "planned",
      category: "feature",
    },
  });

  const [showRoadmapSettings, setShowRoadmapSettings] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<TeamMember[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState<TeamMember[]>([]);
  const [selectedBuilders, setSelectedBuilders] = useState<TeamMember[]>([]);
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [openApproverSelect, setOpenApproverSelect] = useState(false);
  const [openBuilderSelect, setOpenBuilderSelect] = useState(false);
  
  const handleDisplayOnRoadmapChange = (checked: boolean) => {
    setShowRoadmapSettings(checked);
  };

  const loadUsers = async (team: string) => {
    setIsLoadingUsers(true);
    try {
      const users = await fetchAllUsers();
      // Filter users by selected team
      const teamUsers = users.filter(user => user.team_name === team);
      setAvailableUsers(teamUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleTeamChange = (team: string) => {
    form.setValue("team", team);
    loadUsers(team);
    // Reset owner, approvers and builders when team changes
    form.setValue("owner", "");
    form.setValue("owner_id", "");
    form.setValue("approvers", []);
    form.setValue("builders", []);
    setSelectedApprovers([]);
    setSelectedBuilders([]);
  };

  const handleOwnerSelect = (user: TeamMember) => {
    form.setValue("owner", user.name);
    form.setValue("owner_id", user.id);
    setOpenUserSelect(false);
  };

  const handleApproverSelect = (user: TeamMember) => {
    const currentApprovers = form.getValues("approvers") || [];
    
    // Check if user is already selected
    if (!currentApprovers.includes(user.id)) {
      // Add user id to form values
      form.setValue("approvers", [...currentApprovers, user.id]);
      // Add user to selected approvers for display
      setSelectedApprovers(prev => [...prev, user]);
    }
    
    setOpenApproverSelect(false);
  };

  const handleBuilderSelect = (user: TeamMember) => {
    const currentBuilders = form.getValues("builders") || [];
    
    // Check if user is already selected
    if (!currentBuilders.includes(user.id)) {
      // Add user id to form values
      form.setValue("builders", [...currentBuilders, user.id]);
      // Add user to selected builders for display
      setSelectedBuilders(prev => [...prev, user]);
    }
    
    setOpenBuilderSelect(false);
  };

  const removeApprover = (userId: string) => {
    const currentApprovers = form.getValues("approvers") || [];
    form.setValue("approvers", currentApprovers.filter(id => id !== userId));
    setSelectedApprovers(prev => prev.filter(user => user.id !== userId));
  };

  const removeBuilder = (userId: string) => {
    const currentBuilders = form.getValues("builders") || [];
    form.setValue("builders", currentBuilders.filter(id => id !== userId));
    setSelectedBuilders(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
                  placeholder="Enter project description"
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team</FormLabel>
                <Select
                  onValueChange={(value) => handleTeamChange(value)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tech Trading">Tech Trading</SelectItem>
                    <SelectItem value="Tech Custody & Banking">
                      Tech Custody & Banking
                    </SelectItem>
                    <SelectItem value="Tech PMS">Tech PMS</SelectItem>
                    <SelectItem value="Tech Execution">Tech Execution</SelectItem>
                    <SelectItem value="Tech Infrastructure">
                      Tech Infrastructure
                    </SelectItem>
                    <SelectItem value="Business Operations">
                      Business Operations
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => loadUsers(form.getValues("team"))}
                      >
                        {field.value || "Select owner"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No matching users found.</CommandEmpty>
                      <CommandGroup>
                        {isLoadingUsers ? (
                          <div className="flex items-center justify-center p-4">
                            <LoadingSpinner className="h-4 w-4 mr-2" />
                            Loading users...
                          </div>
                        ) : (
                          availableUsers.map(user => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => handleOwnerSelect(user)}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === user.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.name}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormItem>
            <FormLabel>Approvers</FormLabel>
            <Popover open={openApproverSelect} onOpenChange={setOpenApproverSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  onClick={() => loadUsers(form.getValues("team"))}
                >
                  Select approvers
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandEmpty>No matching users found.</CommandEmpty>
                  <CommandGroup>
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center p-4">
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Loading users...
                      </div>
                    ) : (
                      availableUsers.map(user => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => handleApproverSelect(user)}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedApprovers.some(a => a.id === user.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedApprovers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedApprovers.map(user => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeApprover(user.id)}
                    >
                      <XIcon className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Builders</FormLabel>
            <Popover open={openBuilderSelect} onOpenChange={setOpenBuilderSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  onClick={() => loadUsers(form.getValues("team"))}
                >
                  Select builders
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandEmpty>No matching users found.</CommandEmpty>
                  <CommandGroup>
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center p-4">
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Loading users...
                      </div>
                    ) : (
                      availableUsers.map(user => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => handleBuilderSelect(user)}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBuilders.some(b => b.id === user.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedBuilders.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBuilders.map(user => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeBuilder(user.id)}
                    >
                      <XIcon className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter comma-separated tags" {...field} />
              </FormControl>
              <FormDescription>
                Enter tags separated by commas (e.g. "frontend, ui, urgent")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOnRoadmap"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Display on Roadmap</FormLabel>
                <FormDescription>
                  Show this project on the product roadmap
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleDisplayOnRoadmapChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showRoadmapSettings && <RoadmapSettings form={form} />}

        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </Form>
  );
}

// Utility components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
