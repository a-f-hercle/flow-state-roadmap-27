
import { cn } from "@/lib/utils";
import { ProjectPhase } from "@/types";

interface PhaseBadgeProps {
  phase: ProjectPhase;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const phaseColors: Record<ProjectPhase, string> = {
  proposal: "bg-[hsl(var(--phase-proposal))] text-white",
  prototype: "bg-[hsl(var(--phase-prototype))] text-white",
  build: "bg-[hsl(var(--phase-build))] text-white",
  release: "bg-[hsl(var(--phase-release))] text-white",
  results: "bg-[hsl(var(--phase-results))] text-white",
};

const phaseLabels: Record<ProjectPhase, string> = {
  proposal: "Proposal",
  prototype: "Prototype",
  build: "Build",
  release: "Release",
  results: "Results",
};

export function PhaseBadge({ phase, size = "md", className }: PhaseBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        phaseColors[phase],
        sizeClasses[size],
        className
      )}
    >
      {phaseLabels[phase]}
    </span>
  );
}
