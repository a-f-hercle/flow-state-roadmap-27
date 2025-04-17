
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMember } from "./team-member-list";

interface TeamOverviewProps {
  teamProjects: any[];
  roadmapProjects: any[];
  teamMembers: TeamMember[];
}

export const TeamOverview = ({ teamProjects, roadmapProjects, teamMembers }: TeamOverviewProps) => {
  return (
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
  );
};
