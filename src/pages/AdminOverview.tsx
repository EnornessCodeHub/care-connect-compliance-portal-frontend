import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle,
  UserPlus,
  Settings,
  MapPin,
  DollarSign,
  FileText,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "User Management",
      description: "Manage system users, roles, and permissions",
      icon: Users,
      count: "47 Users",
      status: "Active",
      url: "/admin/users"
    },
    {
      title: "Permissions & Roles", 
      description: "Configure user roles and access permissions",
      icon: Shield,
      count: "5 Roles",
      status: "Configured",
      url: "/admin/permissions"
    },
    {
      title: "Pricing Schedules",
      description: "Manage NDIS and private pricing structures",
      icon: DollarSign,
      count: "156 Items",
      status: "Updated",
      url: "/admin/pricing"
    },
    {
      title: "Outlets Management",
      description: "Manage service locations and outlet settings",
      icon: MapPin,
      count: "8 Outlets",
      status: "Active",
      url: "/admin/outlets"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: Settings,
      count: "12 Settings",
      status: "Configured",
      url: "/admin/system"
    },
    {
      title: "Audit Logs",
      description: "View system activity and security logs",
      icon: FileText,
      count: "2,341 Events",
      status: "Monitoring",
      url: "/admin/audit"
    }
  ];

  const systemStats = [
    { label: "Total Users", value: "47", icon: Users, status: "success" },
    { label: "Active Sessions", value: "23", icon: Activity, status: "info" },
    { label: "Failed Logins", value: "3", icon: AlertTriangle, status: "warning" },
    { label: "System Health", value: "98%", icon: Database, status: "success" }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">System administration and management overview</p>
        </div>
        <Button onClick={() => navigate("/admin/users")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge 
                variant={stat.status === "success" ? "default" : stat.status === "warning" ? "secondary" : "outline"}
                className="mt-2"
              >
                {stat.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Management Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate(card.url)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <card.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
                <Badge variant="outline">{card.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">{card.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{card.count}</span>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" onClick={() => navigate("/admin/users")} className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-8 w-8" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/pricing")} className="h-auto p-4 flex flex-col items-center space-y-2">
              <DollarSign className="h-8 w-8" />
              <span>Update Pricing</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/system")} className="h-auto p-4 flex flex-col items-center space-y-2">
              <Settings className="h-8 w-8" />
              <span>System Config</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/audit")} className="h-auto p-4 flex flex-col items-center space-y-2">
              <FileText className="h-8 w-8" />
              <span>View Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}