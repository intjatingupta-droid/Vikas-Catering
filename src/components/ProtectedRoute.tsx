import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
        return;
      }

      try {
        console.log("Verifying token...");
        const response = await fetch("http://localhost:5000/api/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Verification response:", response.status);

        if (response.ok) {
          console.log("Token valid, allowing access");
          setIsAuthenticated(true);
        } else {
          console.log("Token invalid, clearing and redirecting");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setError("Cannot connect to backend. Make sure it's running on port 5000.");
        // Still allow access if backend is down (for development)
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
