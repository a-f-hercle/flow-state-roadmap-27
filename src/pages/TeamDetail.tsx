
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockReviewers } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/context/project-context";
import { ProjectCard } from "@/components/project/project-card";
import { UsersRound } from "lucide-react";

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const { projects } = useProjects();

  // Find team projects
  const teamProjects = projects.filter(project => project.team === teamName);
  
  // Get team members from mockReviewers
  const teamMembers = mockReviewers.filter(member => 
    // This is a simplified way to match team members - in a real app you'd have a more robust relationship
    Math.random() > 0.5
  ).slice(0, 3);

  // Count roadmap projects
  const roadmapProjects = teamProjects.filter(p => p.displayOnRoadmap);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{teamName}</h1>
          <p className="text-muted-foreground">
            Team overview and projects
          </p>
        </div>
        <Button>
          <UsersRound className="mr-2 h-4 w-4" />
          Manage Team Members
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
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

          <div>
            <h2 className="text-xl font-semibold mb-4">Team Projects</h2>
            {teamProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No projects found for this team.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
