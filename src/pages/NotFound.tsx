
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="p-3 bg-primary rounded-lg">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">
            MISHARAIZE FLIX
          </span>
        </div>

        {/* 404 Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/search" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search Videos</span>
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="text-sm text-muted-foreground">
            <p>
              If you think this is an error, please{" "}
              <a href="mailto:support@misharaizeflix.com" className="text-primary hover:underline">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
