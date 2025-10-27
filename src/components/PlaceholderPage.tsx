import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        
        <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            This page is currently under development. Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;