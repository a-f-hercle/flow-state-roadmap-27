
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/context/project-context";
import { UsersRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { TeamMemberList } from "@/components/team/team-member-list";
import { TeamOverview } from "@/components/team/team-overview";
import { TeamProjects } from "@/components/team/team-projects";
import { ManageMembersDialog } from "@/components/team/manage-members-dialog";
import { AddMemberSheet } from "@/components/team/add-member-sheet";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";
import { TeamMember } from "@/components/team/types/team-member";

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const teamProjects = projects.filter(project => project.team === teamName);
  const roadmapProjects = teamProjects.filter(p => p.displayOnRoadmap);

  useEffect(() => {
    async function loadTeamMembers() {
      if (!teamName) return;
      
      try {
        setIsLoading(true);
        const members = await fetchTeamMembers(teamName);
        setTeamMembers(members);
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
        <TeamMemberList 
          teamName={teamName}
          onAddMember={handleAddMember}
        />

        <div className="lg:col-span-2 space-y-6">
          <TeamOverview 
            teamProjects={teamProjects}
            roadmapProjects={roadmapProjects}
            teamMembers={teamMembers}
          />

          <TeamProjects teamProjects={teamProjects} />
        </div>
      </div>
      
      <ManageMembersDialog
        isOpen={isManageMembersOpen}
        onOpenChange={setIsManageMembersOpen}
        teamName={teamName}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        onAddMember={handleAddMember}
        isLoading={isLoading}
      />

      <AddMemberSheet
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        teamName={teamName}
        setTeamMembers={setTeamMembers}
      />
    </div>
  );
}
