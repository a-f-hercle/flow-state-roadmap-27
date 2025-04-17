
import { useProjects } from "@/context/project-context";
import { ProjectCard } from "@/components/project/project-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ProjectPhase } from "@/types";

export function ProjectList() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>([]);

  const phases: ProjectPhase[] = ['proposal', 'prototype', 'build', 'release', 'results'];
  
  const phaseLabels: Record<ProjectPhase, string> = {
    proposal: "Proposal",
    prototype: "Prototype",
    build: "Build",
    release: "Release",
    results: "Results",
  };

  const togglePhase = (phase: ProjectPhase) => {
    setSelectedPhases((current) => 
      current.includes(phase)
        ? current.filter((p) => p !== phase)
        : [...current, phase]
    );
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPhase = 
      selectedPhases.length === 0 || 
      selectedPhases.includes(project.currentPhase);
    
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Phase</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {phases.map((phase) => (
              <DropdownMenuCheckboxItem
                key={phase}
                checked={selectedPhases.includes(phase)}
                onCheckedChange={() => togglePhase(phase)}
              >
                {phaseLabels[phase]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={() => navigate("/projects/new")}>
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button onClick={() => navigate("/projects/new")}>
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
