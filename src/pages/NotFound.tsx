
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">
        Oops! We couldn't find the page you're looking for.
      </p>
      <Button onClick={() => navigate("/")} className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
