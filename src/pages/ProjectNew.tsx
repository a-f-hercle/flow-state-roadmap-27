
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/project-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { mockReviewers } from "@/data/mock-data";
import { Project, ProjectPhase } from "@/types";

export default function ProjectNew() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team: "",
    owner: "",
    tags: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the new project
    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      team: formData.team,
      owner: formData.owner,
      currentPhase: 'proposal',
      phases: {
        proposal: {
          startDate: new Date(),
          status: 'in-progress',
          review: {
            id: Date.now().toString(),
            type: 'OK Review',
            reviewers: mockReviewers.slice(0, 4).map(reviewer => ({
              id: reviewer.id,
              status: 'pending'
            }))
          }
        },
        build: { status: 'not-started' },
        release: { status: 'not-started' },
        results: { status: 'not-started' }
      },
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
    };
    
    addProject(newProject);
    
    toast({
      title: "Project created",
      description: "Your new project has been created successfully."
    });
    
    navigate("/projects");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">Start a new project following the GSD process</p>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this project aims to accomplish"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Project Owner</Label>
                <Input
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="Enter project owner's name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. mobile, analytics, customer"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
