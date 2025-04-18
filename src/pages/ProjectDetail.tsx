import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { PhaseTimeline } from "@/components/project/phase-timeline";
import { ProjectHistory } from "@/components/project/project-history";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Users, Tag, Edit, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockReviewers } from "@/data/mock-data";
import { ReviewStatus } from "@/types";
import { useState, useEffect } from "react";
import { EditProjectDialog } from "@/components/project/edit-project-dialog";
import { fetchTeamMembers } from "@/components/team/services/team-member-service";
import { TeamMember } from "@/components/team/types/team-member";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateReview } = useProjects();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const project = getProject(id || "");
  
  useEffect(() => {
    if (project) {
      loadTeamMembers();
    }
  }, [project]);

  const loadTeamMembers = async () => {
    if (project) {
      try {
        const members = await fetchTeamMembers(project.team);
        setTeamMembers(members);
      } catch (error) {
        console.error("Failed to load team members:", error);
      }
    }
  };
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
      </div>
    );
  }
  
  const currentPhaseData = project.phases[project.currentPhase];
  const currentReview = currentPhaseData?.review;
  
  const getReviewerData = (reviewerId: string) => {
    return mockReviewers.find(reviewer => reviewer.id === reviewerId);
  };

  const findTeamMember = (memberId?: string) => {
    if (!memberId) return null;
    return teamMembers.find(member => member.id === memberId);
  };

  const projectOwner = findTeamMember(project.owner_id);
  
  const getStatusColor = (status: ReviewStatus) => {
    switch(status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  
  const handleReviewAction = (reviewerId: string, status: ReviewStatus) => {
    updateReview(project.id, project.currentPhase, reviewerId, status);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              <PhaseBadge phase={project.currentPhase} />
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Edit Project
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Card className="w-full md:w-auto md:min-w-[200px]">
          <CardContent className="py-4">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Team:</span>
              <span className="font-medium">{project.team}</span>
            </div>
          </CardContent>
        </Card>
        
        {projectOwner && (
          <Card className="w-full md:w-auto md:min-w-[250px]">
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Owner:</span>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={projectOwner.avatar_url} />
                    <AvatarFallback>{projectOwner.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{projectOwner.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="w-full md:w-auto md:min-w-[200px]">
          <CardContent className="py-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Created:</span>
              <span className="font-medium">
                {format(new Date(project.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto md:min-w-[200px]">
          <CardContent className="py-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Updated:</span>
              <span className="font-medium">
                {format(new Date(project.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto md:flex-1">
          <CardContent className="py-4">
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="assignees">Phase Assignees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <PhaseTimeline project={project} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Phase Review</CardTitle>
            </CardHeader>
            <CardContent>
              {currentReview ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {currentReview.type} Review for {project.currentPhase.charAt(0).toUpperCase() + project.currentPhase.slice(1)} Phase
                    </h3>
                    <Badge>
                      {currentReview.reviewers.filter(r => r.status === 'approved').length} / 
                      {currentReview.reviewers.length} Approved
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {currentReview.reviewers.map(reviewer => {
                      const reviewerData = getReviewerData(reviewer.id);
                      if (!reviewerData) return null;
                      
                      return (
                        <div key={reviewer.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={reviewerData.avatar} />
                            <AvatarFallback>{reviewerData.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{reviewerData.name}</p>
                                <p className="text-sm text-muted-foreground">{reviewerData.role}</p>
                              </div>
                              <div className="flex items-center">
                                <span 
                                  className={`text-sm font-medium ${getStatusColor(reviewer.status)}`}
                                >
                                  {reviewer.status.charAt(0).toUpperCase() + reviewer.status.slice(1)}
                                </span>
                                {reviewer.timestamp && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({format(new Date(reviewer.timestamp), "MMM d")})
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {reviewer.feedback && (
                              <p className="text-sm">
                                "{reviewer.feedback}"
                              </p>
                            )}
                            
                            {reviewer.status === 'pending' && (
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                  onClick={() => handleReviewAction(reviewer.id, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleReviewAction(reviewer.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No review needed for the current phase</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <ProjectHistory history={project.history} />
        </TabsContent>
        
        <TabsContent value="assignees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Phase Assignees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold border-l-4 border-blue-500 pl-3">Proposal Phase</h3>
                    <div className="bg-muted/40 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">Approvers</h4>
                      {project.approvers && project.approvers.length > 0 ? (
                        <div className="space-y-2">
                          {project.approvers.map(approverId => {
                            const approver = findTeamMember(approverId);
                            return approver ? (
                              <div key={approverId} className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={approver.avatar_url} />
                                  <AvatarFallback>{approver.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{approver.name}</p>
                                  <p className="text-xs text-muted-foreground">{approver.role}</p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No approvers assigned</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold border-l-4 border-green-500 pl-3">Build Phase</h3>
                    <div className="bg-muted/40 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">Assigned Developers</h4>
                      {project.builders && project.builders.length > 0 ? (
                        <div className="space-y-2">
                          {project.builders.map(builderId => {
                            const builder = findTeamMember(builderId);
                            return builder ? (
                              <div key={builderId} className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={builder.avatar_url} />
                                  <AvatarFallback>{builder.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{builder.name}</p>
                                  <p className="text-xs text-muted-foreground">{builder.role}</p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No builders assigned</p>
                      )}
                    </div>
                  </div>
                </div>
                  
                <div className="text-center">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Assignees
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EditProjectDialog 
        open={isEditDialogOpen} 
        setOpen={setIsEditDialogOpen}
        project={project}
      />
    </div>
  );
}
