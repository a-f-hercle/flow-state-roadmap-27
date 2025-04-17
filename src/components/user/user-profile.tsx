
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  team: string | null;
  role: string | null;
};

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFormData({
          full_name: data.full_name || user.user_metadata.full_name,
          team: data.team,
          role: data.role,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function updateProfile() {
    if (!user || !profile) return;

    try {
      setIsUpdating(true);

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      // Update local profile state
      setProfile({
        ...profile,
        ...updates,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          View and edit your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.user_metadata.avatar_url || profile?.avatar_url || undefined} alt={profile?.full_name || ""} />
            <AvatarFallback className="text-xl">
              {(profile?.full_name || user.user_metadata.full_name || "User")
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.full_name || ""}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select 
              value={formData.team || ""} 
              onValueChange={(value) => setFormData({ ...formData, team: value })}
            >
              <SelectTrigger id="team">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech Trading">Tech Trading</SelectItem>
                <SelectItem value="Tech Custody & Banking">Tech Custody & Banking</SelectItem>
                <SelectItem value="Tech PMS">Tech PMS</SelectItem>
                <SelectItem value="Tech Execution">Tech Execution</SelectItem>
                <SelectItem value="Tech Infrastructure">Tech Infrastructure</SelectItem>
                <SelectItem value="Business Operations">Business Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role || ""} 
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA">QA</SelectItem>
                <SelectItem value="Team Lead">Team Lead</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={updateProfile} 
          disabled={isUpdating}
          className="ml-auto"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
