import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Phone,
  Mail,
  Users,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminOutlets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const outlets = [
    {
      id: 1,
      name: "Central Care Hub",
      address: "123 Main Street, Melbourne VIC 3000",
      phone: "(03) 9123 4567",
      email: "central@healthcare.com",
      manager: "Sarah Johnson",
      staff: 12,
      clients: 45,
      status: "Active",
      hours: "Mon-Fri 8:00-18:00"
    },
    {
      id: 2,
      name: "North Side Centre",
      address: "456 Collins Ave, Preston VIC 3072",
      phone: "(03) 9234 5678",
      email: "north@healthcare.com",
      manager: "Michael Chen",
      staff: 8,
      clients: 32,
      status: "Active",
      hours: "Mon-Fri 9:00-17:00"
    },
    {
      id: 3,
      name: "Eastern Support Office",
      address: "789 Burke Road, Camberwell VIC 3124",
      phone: "(03) 9345 6789",
      email: "east@healthcare.com",
      manager: "Emma Wilson",
      staff: 6,
      clients: 28,
      status: "Active",
      hours: "Mon-Fri 8:30-17:30"
    },
    {
      id: 4,
      name: "Community Outreach Centre",
      address: "321 High Street, Frankston VIC 3199",
      phone: "(03) 9456 7890",
      email: "outreach@healthcare.com",
      manager: "James Miller",
      staff: 4,
      clients: 18,
      status: "Maintenance",
      hours: "Mon-Thu 9:00-16:00"
    }
  ];

  const handleOutletAction = (action: string, outletId: number) => {
    toast({
      title: `Outlet ${action}`,
      description: `Action "${action}" performed for outlet ID: ${outletId}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outlets Management</h1>
          <p className="text-muted-foreground">Manage service locations and outlet settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
          <Button onClick={() => handleOutletAction("Add New Outlet", 0)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Outlet
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Outlets</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search outlets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {outlets.map((outlet) => (
              <Card key={outlet.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{outlet.name}</CardTitle>
                    </div>
                    <Badge variant={outlet.status === "Active" ? "default" : "secondary"}>
                      {outlet.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{outlet.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{outlet.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{outlet.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{outlet.hours}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold">{outlet.staff}</div>
                      <div className="text-xs text-muted-foreground">Staff</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{outlet.clients}</div>
                      <div className="text-xs text-muted-foreground">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Manager</div>
                      <div className="text-sm font-medium">{outlet.manager}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleOutletAction("View", outlet.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOutletAction("Edit", outlet.id)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOutletAction("Delete", outlet.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outlet Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Outlets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-muted-foreground text-sm">Service locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">30</div>
            <p className="text-muted-foreground text-sm">Across all outlets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">123</div>
            <p className="text-muted-foreground text-sm">Being served</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-muted-foreground text-sm">Current utilization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}