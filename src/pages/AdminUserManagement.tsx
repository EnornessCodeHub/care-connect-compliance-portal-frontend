import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Shield,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@healthcare.com",
      role: "System Administrator",
      status: "Active",
      lastLogin: "2024-01-15 09:30 AM",
      permissions: ["Full Access", "User Management", "System Config"],
      caseViewingPermissions: "All Cases"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@healthcare.com",
      role: "Care Manager",
      status: "Active",
      lastLogin: "2024-01-15 08:45 AM",
      permissions: ["Client Management", "Reports", "Scheduling"],
      caseViewingPermissions: "Assigned Cases Only"
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.wilson@healthcare.com",
      role: "Support Worker",
      status: "Inactive",
      lastLogin: "2024-01-10 03:20 PM",
      permissions: ["Client Care", "Timesheets"],
      caseViewingPermissions: "Own Cases Only"
    },
    {
      id: 4,
      name: "James Miller",
      email: "james.miller@healthcare.com",
      role: "Compliance Officer",
      status: "Active",
      lastLogin: "2024-01-15 10:15 AM",
      permissions: ["Compliance", "Auditing", "Reports"],
      caseViewingPermissions: "All Cases"
    }
  ];

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: `User ${action}`,
      description: `Action "${action}" performed for user ID: ${userId}`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their access permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
          <Button onClick={() => handleUserAction("Add New User", 0)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Users</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold">{user.name}</h4>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role} • Last login: {user.lastLogin}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Cases: {user.caseViewingPermissions}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleUserAction("View", user.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleUserAction("Edit", user.id)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleUserAction("Edit Permissions", user.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleUserAction("Delete", user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-muted-foreground text-sm">Currently logged in</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-muted-foreground text-sm">New user accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-muted-foreground text-sm">Require admin approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}