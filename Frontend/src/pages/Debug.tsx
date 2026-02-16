import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Debug() {
  const [backendStatus, setBackendStatus] = useState<string>("Not checked");
  const [tokenStatus, setTokenStatus] = useState<string>("Not checked");

  const checkBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/verify", {
        headers: {
          Authorization: `Bearer test`,
        },
      });
      setBackendStatus(`Backend responding: ${response.status}`);
    } catch (error) {
      setBackendStatus(`Backend error: ${error}`);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    setTokenStatus(`Token: ${token ? "Present" : "Missing"}, Username: ${username || "None"}`);
  };

  const clearStorage = () => {
    localStorage.clear();
    alert("LocalStorage cleared! Refresh the page.");
  };

  const fixSiteData = () => {
    // Clear only the site data, keep auth tokens
    localStorage.removeItem("catering-site-data");
    alert("Site data reset! Refresh the page to load defaults.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button onClick={checkBackend} className="w-full mb-2">
              Check Backend
            </Button>
            <p className="text-sm text-muted-foreground">{backendStatus}</p>
          </div>

          <div>
            <Button onClick={checkToken} className="w-full mb-2" variant="secondary">
              Check Token
            </Button>
            <p className="text-sm text-muted-foreground">{tokenStatus}</p>
          </div>

          <div>
            <Button onClick={fixSiteData} className="w-full mb-2" variant="outline">
              Fix Site Data (Recommended)
            </Button>
            <p className="text-xs text-muted-foreground">Resets site data to defaults, keeps login</p>
          </div>

          <div>
            <Button onClick={clearStorage} className="w-full" variant="destructive">
              Clear All LocalStorage
            </Button>
            <p className="text-xs text-muted-foreground">Clears everything including login</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-2">Quick Links:</p>
            <div className="space-y-2">
              <a href="/login" className="block text-sm text-primary hover:underline">
                → Go to Login
              </a>
              <a href="/admin" className="block text-sm text-primary hover:underline">
                → Go to Admin
              </a>
              <a href="/our-work" className="block text-sm text-primary hover:underline">
                → Go to Our Work
              </a>
              <a href="/" className="block text-sm text-primary hover:underline">
                → Go to Home
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
