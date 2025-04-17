
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/context/project-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectNew from "./pages/ProjectNew";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Roadmap from "./pages/Roadmap";
import TaskDetailPage from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ProjectProvider>
          <div className="min-h-screen">
            <SidebarProvider defaultOpen>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/new" element={<ProjectNew />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/teams/:teamName" element={<TeamDetail />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/roadmap/tasks/:id" element={<TaskDetailPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </div>
          <Toaster />
          <Sonner />
        </ProjectProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
