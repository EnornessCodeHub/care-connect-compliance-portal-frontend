import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import staffService from "@/services/staffService";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserCheck, 
  UserX,
  Bot,
  Bell,
  MessageSquare,
  GraduationCap,
  FileText,
  CheckSquare,
  Loader2,
  Shield
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const isAdmin = authService.isAdmin();
  
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [staffStats, setStaffStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    if (isAdmin) {
      loadStaffStats();
    } else {
      setLoading(false);
    }
    loadUserData();
  }, [isAdmin]);

  const loadUserData = () => {
    const userData = authService.getUserData();
    if (userData) {
      setFullName(userData.fullname || userData.username || 'User');
    }
  };

  const loadStaffStats = async () => {
    try {
      setLoading(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        const total = response.data.length;
        // Status is a boolean: true = active, false = inactive
        const active = response.data.filter(staff => staff.status === true).length;
        const inactive = response.data.filter(staff => staff.status === false).length;
        
        setStaffStats({
          total,
          active,
          inactive
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff statistics"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      title: "NADO AI Assistant",
      description: "AI-powered compliance assistant",
      icon: Bot,
      color: "bg-cyan-500",
      route: "/nado"
    },
    {
      title: "Staff Management",
      description: "Manage staff members and roles",
      icon: Users,
      color: "bg-blue-500",
      route: "/staff",
      adminOnly: true
    },
    {
      title: "Admin Management",
      description: "Manage admin members and roles",
      icon: Shield,
      color: "bg-indigo-500",
      route: "/admin",
      adminOnly: true
    },
    {
      title: "Notifications",
      description: "Send and manage notifications",
      icon: Bell,
      color: "bg-orange-500",
      route: "/notifications",
      adminOnly: true
    },
    {
      title: "Internal Chat",
      description: "Team communication",
      icon: MessageSquare,
      color: "bg-green-500",
      route: "/chat"
    },
    {
      title: "Training & Courses",
      description: "Manage training programs",
      icon: GraduationCap,
      color: "bg-purple-500",
      route: "/course"
    },
    {
      title: "Document Center",
      description: "Access documents and templates",
      icon: FileText,
      color: "bg-yellow-500",
      route: "/documents"
    },
    {
      title: "E-Signature Documents",
      description: "Upload, configure, and manage e-signature documents",
      icon: CheckSquare,
      color: "bg-red-500",
      route: "/forms"
    }
  ];

  // Filter quick links based on user role
  const filteredQuickLinks = quickLinks.filter(link => {
    if (link.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {fullName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your portal today.
          </p>
      </div>

        {/* Staff Statistics - Only for Admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staffStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All staff members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{staffStats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Staff</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{staffStats.inactive}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently inactive
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredQuickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.route}
                    onClick={() => navigate(link.route)}
                    className="flex flex-col items-start p-4 rounded-lg border bg-card hover:bg-accent hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className={`p-2 rounded-lg ${link.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-1">{link.title}</h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
