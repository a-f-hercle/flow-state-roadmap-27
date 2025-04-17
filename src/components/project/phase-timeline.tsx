import { ProjectPhase, Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Circle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface PhaseTimelineProps {
  project: Project;
}

export function PhaseTimeline({ project }: PhaseTimelineProps) {
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
                  index <= currentPhaseIndex ? phaseColors[phase] : "bg-secondary"
                )}
              >
                {getStatusIcon(phase)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{phaseLabels[phase]}</h4>
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(phase)}
                  </span>
                </div>
                
                {project.phases[phase]?.notes && (
                  <p className="text-sm mt-1">{project.phases[phase]?.notes}</p>
                )}
                
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
