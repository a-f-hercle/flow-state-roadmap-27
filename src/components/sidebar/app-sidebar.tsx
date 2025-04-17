import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Settings, 
  Users, 
  Route, 
  Image as ImageIcon, 
  Upload,
  LogOut,
  User
} from "lucide-react";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoImage, setLogoImage] = useState<string | null>(localStorage.getItem("app-logo"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setLogoImage(imageDataUrl);
      localStorage.setItem("app-logo", imageDataUrl);
      setIsDialogOpen(false);
      toast({
        title: "Logo updated",
        description: "Your logo has been updated successfully",
      });
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openLogoDialog = () => {
    setIsDialogOpen(true);
  };

  const removeImage = () => {
    setLogoImage(null);
    localStorage.removeItem("app-logo");
    setIsDialogOpen(false);
    toast({
      title: "Logo removed",
      description: "Your logo has been removed",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      label: "Projects",
      icon: Briefcase,
      path: "/projects",
    },
    {
      label: "Teams",
      icon: Users,
      path: "/teams",
    },
    {
      label: "Roadmap",
      icon: Route,
      path: "/roadmap",
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center space-x-2">
          <div 
            className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold cursor-pointer overflow-hidden"
            onClick={openLogoDialog}
          >
            {logoImage ? (
              <img src={logoImage} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              "FS"
            )}
          </div>
          <h1 className="text-lg font-bold">Flow State</h1>
        </div>
        <div className="flex-1" />
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        {user && (
          <div className="px-3 py-2 mb-2">
            <Button 
              className="w-full justify-start" 
              onClick={() => navigate("/projects/new")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                  >
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/search")}>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate("/search")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/profile")}>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              
              {user && (
                <div className="px-3 py-2 mt-2">
                  <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Logo Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Logo</DialogTitle>
            <DialogDescription>
              Upload an image to replace the "FS" logo in the sidebar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="h-24 w-24 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                  <span className="text-xs mt-1">No image</span>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            
            <div className="flex gap-2">
              <Button onClick={openFileDialog} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {logoImage ? 'Change Image' : 'Upload Image'}
              </Button>
              
              {logoImage && (
                <Button variant="outline" onClick={removeImage}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
