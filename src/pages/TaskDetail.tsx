
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/roadmap">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roadmap
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Task ID: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Task detail view is currently being rebuilt for improved functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
