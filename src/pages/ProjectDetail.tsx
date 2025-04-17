import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { PhaseTimeline } from "@/components/project/phase-timeline";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Users, Tag, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockReviewers } from "@/data/mock-data";
import { ReviewStatus } from "@/types";
import { useState } from "react";
import { EditProjectDialog } from "@/components/project/edit-project-dialog";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateReview } = useProjects();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const project = getProject(id || "");
  
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
      </Tabs>
      
      <EditProjectDialog 
        open={isEditDialogOpen} 
        setOpen={setIsEditDialogOpen}
        project={project}
      />
    </div>
  );
}
