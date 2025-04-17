
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';

export default function Auth() {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Flow State</CardTitle>
          <CardDescription>
            Sign in to access your task management workspace
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-center"
              onClick={signInWithGoogle}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
    </div>
  );
}
