
import { ProjectPhase, Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Circle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PhaseTimelineProps {
  project: Project;
  teamMembers?: any[];
}

export function PhaseTimeline({ project, teamMembers = [] }: PhaseTimelineProps) {
  const phases: ProjectPhase[] = ["proposal", "build", "release", "results"];
  
  const phaseLabels: Record<ProjectPhase, string> = {
    proposal: "Proposal",
    build: "Build",
    release: "Release",
    results: "Results",
  };

  const phaseColors: Record<ProjectPhase, string> = {
    proposal: "bg-[hsl(var(--phase-proposal))]",
    build: "bg-[hsl(var(--phase-build))]",
    release: "bg-[hsl(var(--phase-release))]",
    results: "bg-[hsl(var(--phase-results))]",
  };

  const getStatusIcon = (phase: ProjectPhase) => {
    const status = project.phases[phase]?.status;
    
    if (status === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === "in-progress") {
      return <Clock className="h-4 w-4 text-blue-500" />;
    } else if (status === "not-started") {
      return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
    
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = (phase: ProjectPhase) => {
    const phaseData = project.phases[phase];
    
    if (!phaseData) return "Not Started";
    
    if (phaseData.status === "completed") {
      return phaseData.endDate ? `Completed ${format(new Date(phaseData.endDate), "MMM d, yyyy")}` : "Completed";
    } else if (phaseData.status === "in-progress") {
      return phaseData.startDate ? `Started ${format(new Date(phaseData.startDate), "MMM d, yyyy")}` : "In Progress";
    }
    
    return "Not Started";
  };

  const currentPhaseIndex = phases.indexOf(project.currentPhase);
  
  const findTeamMember = (memberId: string) => {
    return teamMembers.find(member => member.id === memberId);
  };
  
  const getPhaseAssignees = (phase: ProjectPhase) => {
    if (phase === 'proposal' && project.approvers?.length) {
      return (
        <div className="mt-2 flex -space-x-2 overflow-hidden">
          {project.approvers.slice(0, 5).map((approverId) => {
            const member = findTeamMember(approverId);
            return member ? (
              <Avatar key={approverId} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.name?.[0]}</AvatarFallback>
              </Avatar>
            ) : null;
          })}
          {project.approvers.length > 5 && (
            <div className="flex items-center justify-center h-6 w-6 bg-muted text-xs rounded-full border-2 border-background">
              +{project.approvers.length - 5}
            </div>
          )}
        </div>
      );
    }
    
    if (phase === 'build' && project.builders?.length) {
      return (
        <div className="mt-2 flex -space-x-2 overflow-hidden">
          {project.builders.slice(0, 5).map((builderId) => {
            const member = findTeamMember(builderId);
            return member ? (
              <Avatar key={builderId} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.name?.[0]}</AvatarFallback>
              </Avatar>
            ) : null;
          })}
          {project.builders.length > 5 && (
            <div className="flex items-center justify-center h-6 w-6 bg-muted text-xs rounded-full border-2 border-background">
              +{project.builders.length - 5}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Project Timeline</h3>
        <Badge variant="outline">Current: {phaseLabels[project.currentPhase]}</Badge>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-4 left-4 h-[calc(100%-32px)] w-px bg-border"></div>
        
        {/* Timeline points */}
        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div 
              key={phase} 
              className={cn(
                "relative flex items-start pl-10",
                index < currentPhaseIndex ? "text-muted-foreground" : ""
              )}
            >
              {/* Phase dot */}
              <div 
                className={cn(
                  "absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center",
                  index === currentPhaseIndex ? "ring-2 ring-ring ring-offset-2" : "",
                  index <= currentPhaseIndex ? phaseColors[phase] : "bg-secondary"
                )}
              >
                {getStatusIcon(phase)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "font-medium text-sm",
                    index === currentPhaseIndex ? "font-bold" : ""
                  )}>
                    {phaseLabels[phase]}
                    {index === currentPhaseIndex && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Current
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(phase)}
                  </span>
                </div>
                
                {project.phases[phase]?.notes && (
                  <p className="text-sm mt-1">{project.phases[phase]?.notes}</p>
                )}
                
                {getPhaseAssignees(phase)}
                
                {project.phases[phase]?.review && (
                  <div className="mt-2 p-2 bg-secondary rounded text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {project.phases[phase]?.review?.type} Review
                      </span>
                      
                      <span>
                        {project.phases[phase]?.review?.reviewers.filter(r => r.status === 'approved').length} / 
                        {project.phases[phase]?.review?.reviewers.length} approved
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
