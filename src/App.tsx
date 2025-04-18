import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProjectProvider } from "@/context/project-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AuthProvider, useAuth } from "@/context/auth-context";
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
import UserManagement from "./pages/UserManagement";

const queryClient = new QueryClient();

// Modified ProtectedRoute component to allow access when bypassing auth
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, bypassAuth } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }
  
  // Allow access when bypassing authentication
  if (!user && !bypassAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, bypassAuth } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user || bypassAuth ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/new" element={<ProtectedRoute><ProjectNew /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
      <Route path="/teams/:teamName" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/roadmap/tasks/:id" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProjectProvider>
            <div className="min-h-screen">
              <SidebarProvider defaultOpen>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <main className="flex-1 overflow-y-auto p-6">
                    <AppRoutes />
                  </main>
                </div>
              </SidebarProvider>
            </div>
            <Toaster />
            <Sonner position="top-right" closeButton richColors />
          </ProjectProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
