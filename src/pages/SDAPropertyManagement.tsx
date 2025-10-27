import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { Building, MapPin, Users, DollarSign, Calendar, CheckCircle2, AlertTriangle, Plus } from "lucide-react";

const SDAPropertyManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDA Property Management</h1>
          <p className="text-muted-foreground">Manage Specialist Disability Accommodation properties and tenancies</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Tenant
          </Button>
        </div>
      </div>

      <DashboardSection title="Property Overview" className="mb-8">
        <DashboardTile
          title="Total Properties"
          value="24"
          subtitle="Active SDA properties"
          status="success"
        />
        <DashboardTile
          title="Occupancy Rate"
          value="92%"
          subtitle="Current occupancy"
          status="success"
        />
        <DashboardTile
          title="Monthly Revenue"
          value="$45,680"
          subtitle="NDIS payments + top-ups"
          status="success"
        />
        <DashboardTile
          title="Pending Inspections"
          value="3"
          subtitle="Compliance checks due"
          status="warning"
        />
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Properties
            </CardTitle>
            <CardDescription>Manage property configurations and accessibility features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sunrise Villa - Unit 1</h4>
                  <p className="text-sm text-muted-foreground">123 Main St, Melbourne VIC</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">High Physical Support</Badge>
                    <Badge variant="outline">2 Bed</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Occupied</div>
                  <div className="text-xs text-muted-foreground">Rent: $2,100/wk</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Garden Court - Unit 3</h4>
                  <p className="text-sm text-muted-foreground">456 Oak Ave, Brisbane QLD</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Fully Accessible</Badge>
                    <Badge variant="outline">1 Bed</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">Vacant</div>
                  <div className="text-xs text-muted-foreground">Target: $1,850/wk</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View All Properties</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tenant Register
            </CardTitle>
            <CardDescription>NDIS participants and lease agreements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">NDIS: 1234567890</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Active Lease</Badge>
                    <Badge variant="outline">SIL Support</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Sunrise Villa - Unit 1</div>
                  <div className="text-xs text-muted-foreground">Lease exp: 31/Dec/24</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">NDIS: 0987654321</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Application</Badge>
                    <Badge variant="outline">High Support</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Garden Court - Unit 3</div>
                  <div className="text-xs text-muted-foreground">Move-in: 15/Feb/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View All Tenants</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Rent & Board Tracking
            </CardTitle>
            <CardDescription>NDIS payment claims and top-up payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$38,400</div>
                <div className="text-sm text-green-700">NDIS Payments</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$7,280</div>
                <div className="text-sm text-blue-700">Top-up Payments</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>
            <Button className="w-full" variant="outline">Generate Claims Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Compliance & Safety
            </CardTitle>
            <CardDescription>Building safety checks and maintenance schedules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Fire Safety Inspection</h4>
                  <p className="text-sm text-muted-foreground">Sunrise Villa - Annual check</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">Due 15/Feb</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Accessibility Audit</h4>
                  <p className="text-sm text-muted-foreground">Garden Court - Compliance review</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Completed</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">HVAC Maintenance</h4>
                  <p className="text-sm text-muted-foreground">All properties - Quarterly service</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View Compliance Calendar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SDAPropertyManagement;