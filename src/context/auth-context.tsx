
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  bypassAuth: boolean; // Add a bypass flag
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Set to false initially
  const [bypassAuth, setBypassAuth] = useState(true); // Set bypass to true for now
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: `Welcome${currentSession?.user?.email ? ', ' + currentSession.user.email : ''}!`,
          });
          
          // Check if this user was invited to any teams
          if (currentSession?.user?.email) {
            setTimeout(() => {
              linkUserToTeamInvites(currentSession.user!.id, currentSession.user!.email!);
            }, 0);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out",
          });
        }
      }
    );

    // No need to check for session initially when bypassing

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Function to link a user to any team invites that match their email
  async function linkUserToTeamInvites(userId: string, email: string) {
    try {
      // Find any team_members records with matching email but no user_id
      const { data, error } = await supabase
        .from('team_members')
        .update({ user_id: userId, invited: false })
        .match({ email: email, user_id: null })
        .select();
      
      if (error) throw error;
      
      // If any team invites were linked
      if (data && data.length > 0) {
        toast({
          title: "Team assignments linked",
          description: `You've been linked to ${data.length} team(s) based on your email`,
        });
      }
    } catch (error) {
      console.error("Error linking user to team invites:", error);
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast({
        title: "Sign out failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, bypassAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
