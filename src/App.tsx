
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/context/project-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/context/auth-context";
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

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  
  // Don't show the sidebar on auth page or when loading
  const showSidebar = !location.pathname.includes('/auth') && user !== null && !isLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProjectProvider>
      <div className="min-h-screen">
        {showSidebar ? (
          <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto p-6">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                  <Route path="/projects/new" element={<ProtectedRoute><ProjectNew /></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
                  <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                  <Route path="/teams/:teamName" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
                  <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                  <Route path="/roadmap/tasks/:id" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </div>
    </ProjectProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
