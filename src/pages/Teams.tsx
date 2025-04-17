
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockReviewers } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { useProjects } from "@/context/project-context";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  
  // Group projects by team
  const projectsByTeam = projects.reduce((acc, project) => {
    acc[project.team] = (acc[project.team] || []).concat(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  // Count roadmap projects
  const roadmapProjectsByTeam = projects
    .filter(p => p.displayOnRoadmap)
    .reduce((acc, project) => {
      acc[project.team] = (acc[project.team] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  // Create team structures from the image
  const teams = [
    {
      name: "Tech Trading",
      description: "Trading platform development and enhancements",
      members: [mockReviewers[0], mockReviewers[6]],
      projectCount: projectsByTeam["Tech Trading"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Tech Trading"] || 0,
      color: "bg-indigo-100"
    },
    {
      name: "Tech Custody & Banking",
      description: "Banking solutions and custody services",
      members: [mockReviewers[4], mockReviewers[7]],
      projectCount: projectsByTeam["Tech Custody & Banking"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Tech Custody & Banking"] || 0,
      color: "bg-yellow-100"
    },
    {
      name: "Tech PMS",
      description: "Portfolio Management Systems",
      members: [mockReviewers[3], mockReviewers[2]],
      projectCount: projectsByTeam["Tech PMS"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Tech PMS"] || 0,
      color: "bg-red-100"
    },
    {
      name: "Tech Execution",
      description: "Trade execution systems and services",
      members: [mockReviewers[6], mockReviewers[1], mockReviewers[5]],
      projectCount: projectsByTeam["Tech Execution"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Tech Execution"] || 0,
      color: "bg-green-100"
    },
    {
      name: "Tech Infrastructure",
      description: "Core platform infrastructure and security",
      members: [mockReviewers[0], mockReviewers[6]],
      projectCount: projectsByTeam["Tech Infrastructure"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Tech Infrastructure"] || 0,
      color: "bg-orange-100"
    },
    {
      name: "Business Operations",
      description: "Business process optimization and tools",
      members: [mockReviewers[4], mockReviewers[5], mockReviewers[2]],
      projectCount: projectsByTeam["Business Operations"]?.length || 0,
      roadmapCount: roadmapProjectsByTeam["Business Operations"] || 0,
      color: "bg-pink-100"
    }
  ];

  const handleViewTeam = (teamName: string) => {
    navigate(`/teams/${encodeURIComponent(teamName)}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            View and manage teams across the organization
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.name} className={`border-l-4 border-l-${team.color.split('-')[1]}-300`}>
            <CardHeader className={team.color}>
              <div className="flex justify-between items-start">
                <CardTitle>{team.name}</CardTitle>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline">
                    {team.projectCount} Project{team.projectCount !== 1 ? 's' : ''}
                  </Badge>
                  {team.roadmapCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {team.roadmapCount} on roadmap
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex -space-x-2">
                {team.members.map(member => (
                  <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {team.members.length > 0 && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs">
                    {team.members.length}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleViewTeam(team.name)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Team
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
