
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Flow State</CardTitle>
          <CardDescription>
            Authentication is currently disabled
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center text-muted-foreground">
            Sign-in functionality will be restored soon.
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
          <p>Authentication is temporarily unavailable</p>
        </CardFooter>
      </Card>
    </div>
  );
}
