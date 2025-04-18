
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

export default function Roadmap() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>
          <p className="text-muted-foreground">
            Planning and tracking of projects
          </p>
        </div>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Building New Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="mb-4">
            <p className="text-muted-foreground">
              We're rebuilding the roadmap with improved features and stability.
            </p>
          </div>
          <div className="flex justify-center">
            <Link to="/projects">
              <Button variant="outline">View Projects</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
