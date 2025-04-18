
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their roles
          </p>
        </div>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Building New User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="mb-4">
            <p className="text-muted-foreground">
              We're rebuilding the user management system with improved features and stability.
            </p>
          </div>
          <div className="flex justify-center">
            <Link to="/teams">
              <Button variant="outline">View Teams</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
