
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TeamMember } from "./types/team-member";

interface TeamMemberListProps {
  teamName: string;
  onAddMember: () => void;
  teamMembers: TeamMember[];
}

export const TeamMemberList = ({ teamName, onAddMember, teamMembers = [] }: TeamMemberListProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.length > 0 ? (
          teamMembers.map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar_url} alt={member.name} />
                <AvatarFallback>{member.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
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
          onClick={onAddMember}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </CardContent>
    </Card>
  );
};
