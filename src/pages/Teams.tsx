
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockReviewers } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useProjects } from "@/context/project-context";

export default function Teams() {
  const { projects } = useProjects();
  
  // Group projects by team
  const projectsByTeam = projects.reduce((acc, project) => {
    acc[project.team] = (acc[project.team] || []).concat(project);
    return acc;
  }, {} as Record<string, typeof projects>);
  
  // Create team structures from mock reviewers
  const teams = [
    {
      name: "Product Experience",
      description: "Focused on customer-facing product features",
      members: mockReviewers.slice(0, 3),
      projectCount: projectsByTeam["Product Experience"]?.length || 0
    },
    {
      name: "Operations",
      description: "Internal tools and operational efficiency",
      members: mockReviewers.slice(3, 5),
      projectCount: projectsByTeam["Operations"]?.length || 0
    },
    {
      name: "E-commerce",
      description: "Online shopping experience and conversion",
      members: [mockReviewers[1], mockReviewers[5], mockReviewers[6]],
      projectCount: projectsByTeam["E-commerce"]?.length || 0
    },
    {
      name: "Data",
      description: "Analytics and data insights",
      members: [mockReviewers[3], mockReviewers[7]],
      projectCount: projectsByTeam["Data"]?.length || 0
    },
    {
      name: "Supply Chain",
      description: "Supply chain management and logistics",
      members: [mockReviewers[2], mockReviewers[4], mockReviewers[7]],
      projectCount: projectsByTeam["Supply Chain"]?.length || 0
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            View and manage teams across your organization
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.name}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{team.name}</CardTitle>
                <Badge variant="outline">
                  {team.projectCount} Project{team.projectCount !== 1 ? 's' : ''}
                </Badge>
              </div>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
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
              <Button variant="outline" className="w-full">View Team</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
