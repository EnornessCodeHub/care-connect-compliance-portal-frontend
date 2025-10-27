import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { initializeSampleData } from "@/lib/sampleStaffData";
import { Database, Users, Calendar, MapPin, CheckCircle } from "lucide-react";

export default function StaffDataInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setIsInitializing(true);
    
    try {
      const success = await initializeSampleData();
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Sample Data Created",
          description: "Staff tracking sample data has been initialized successfully",
        });
      } else {
        throw new Error("Failed to initialize data");
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to create sample data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Staff Tracking Setup
        </CardTitle>
        <CardDescription>
          Initialize sample data for testing the staff tracking features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Users className="h-4 w-4 text-blue-500" />
            <div className="text-sm">
              <div className="font-medium">4 Staff Members</div>
              <div className="text-muted-foreground">Sample profiles</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Calendar className="h-4 w-4 text-green-500" />
            <div className="text-sm">
              <div className="font-medium">Shifts & Appointments</div>
              <div className="text-muted-foreground">Today's schedule</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <MapPin className="h-4 w-4 text-red-500" />
            <div className="text-sm">
              <div className="font-medium">Location Data</div>
              <div className="text-muted-foreground">GPS coordinates</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <CheckCircle className="h-4 w-4 text-purple-500" />
            <div className="text-sm">
              <div className="font-medium">Check-in Records</div>
              <div className="text-muted-foreground">Sample history</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">What will be created:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Sample staff profiles with contact information</li>
            <li>• Today's shifts for different staff members</li>
            <li>• Scheduled appointments with clients</li>
            <li>• Mock GPS locations for testing the live dashboard</li>
            <li>• Various status examples (checked in, scheduled, etc.)</li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={handleInitialize} 
            disabled={isInitializing || isInitialized}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            {isInitializing ? "Initializing..." : "Initialize Sample Data"}
          </Button>
          
          {isInitialized && (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Data Initialized
            </Badge>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <strong>Note:</strong> This will create sample data in your database. You can delete or modify this data later through the admin interface.
        </div>
      </CardContent>
    </Card>
  );
}