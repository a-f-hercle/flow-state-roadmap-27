
import { useProjects } from "@/context/project-context";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowUpRight } from "lucide-react";
import { ProjectPhase } from "@/types";

export default function Dashboard() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  
  // Count projects by phase
  const projectsByPhase = projects.reduce((acc, project) => {
    const phase = project.currentPhase;
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {} as Record<ProjectPhase, number>);
  
  // Get projects that need review
  const projectsNeedingReview = projects.filter(project => {
    const currentPhaseData = project.phases[project.currentPhase];
    return currentPhaseData?.review && 
      currentPhaseData.review.reviewers.some(r => r.status === 'pending');
  });
  
  // Get recently updated projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  const phases: ProjectPhase[] = ['proposal', 'prototype', 'build', 'release', 'results'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your team's projects and tasks
          </p>
        </div>
        <Button onClick={() => navigate("/projects/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      {/* Phase metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {phases.map(phase => (
          <Card key={phase}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <PhaseBadge phase={phase} />
                <span className="text-2xl font-bold">
                  {projectsByPhase[phase] || 0}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Review */}
        <Card>
          <CardHeader>
            <CardTitle>Needs Review</CardTitle>
            <CardDescription>
              Projects waiting for your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectsNeedingReview.length > 0 ? (
              <div className="space-y-4">
                {projectsNeedingReview.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhaseBadge phase={project.currentPhase} size="sm" />
                        <span>•</span>
                        <span>{project.team}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No projects need your review right now</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Recently modified projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhaseBadge phase={project.currentPhase} size="sm" />
                        <span>•</span>
                        <span>{project.owner}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No recent project updates</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
