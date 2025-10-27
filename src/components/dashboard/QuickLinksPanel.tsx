import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  Bell, 
  FileText, 
  GraduationCap,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const coreModules = [
  {
    id: 'portal',
    title: 'Portal',
    description: 'Main dashboard and overview',
    url: '/',
    icon: LayoutDashboard,
    color: 'bg-blue-500',
    hasPermission: () => true
  },
  {
    id: 'nado',
    title: 'NADO AI',
    description: 'AI-powered assistant',
    url: '/nado',
    icon: Bot,
    color: 'bg-purple-500',
    hasPermission: () => true
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Team management',
    url: '/team',
    icon: Users,
    color: 'bg-green-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('users', 'read')
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Alerts and messages',
    url: '/notifications',
    icon: Bell,
    color: 'bg-orange-500',
    hasPermission: () => true
  }
];

const additionalModules = [
  {
    id: 'documents',
    title: 'Document Center',
    description: 'Compliance templates and forms',
    url: '/documents',
    icon: FileText,
    color: 'bg-indigo-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('documents', 'read')
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Courses and certifications',
    url: '/training',
    icon: GraduationCap,
    color: 'bg-emerald-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('training', 'read')
  },
  {
    id: 'forms',
    title: 'Form Builder',
    description: 'Create and manage forms',
    url: '/forms',
    icon: MessageSquare,
    color: 'bg-rose-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('forms', 'read')
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Analytics and insights',
    url: '/reports',
    icon: BarChart3,
    color: 'bg-cyan-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('reports', 'read')
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Regulatory tracking',
    url: '/compliance',
    icon: Shield,
    color: 'bg-amber-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('compliance', 'read')
  },
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Schedule management',
    url: '/appointments',
    icon: Calendar,
    color: 'bg-teal-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('appointments', 'read')
  },
  {
    id: 'timesheets',
    title: 'Timesheets',
    description: 'Time tracking',
    url: '/timesheets',
    icon: Clock,
    color: 'bg-violet-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('timesheets', 'read')
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'System administration',
    url: '/admin',
    icon: Settings,
    color: 'bg-gray-500',
    hasPermission: (hasPermission: (resource: string, action: string) => boolean) => 
      hasPermission('admin', 'all')
  }
];

export function QuickLinksPanel() {
  const { hasPermission } = useUser();
  const navigate = useNavigate();

  const handleModuleClick = (url: string) => {
    navigate(url);
  };

  const filteredCoreModules = coreModules.filter(module => 
    module.hasPermission(hasPermission)
  );

  const filteredAdditionalModules = additionalModules.filter(module => 
    module.hasPermission(hasPermission)
  );

  return (
    <div className="space-y-6">
      {/* Core Modules */}
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Core Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {filteredCoreModules.map((module) => (
              <Button
                key={module.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 group"
                onClick={() => handleModuleClick(module.url)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${module.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <module.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{module.title}</div>
                    <div className="text-xs text-muted-foreground">{module.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Modules */}
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Additional Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {filteredAdditionalModules.map((module) => (
              <Button
                key={module.id}
                variant="ghost"
                className="h-auto p-3 flex items-center gap-3 hover:bg-primary/5 transition-all duration-200 group"
                onClick={() => handleModuleClick(module.url)}
              >
                <div className={`p-2 rounded-lg ${module.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                  <module.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{module.title}</div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Active Modules</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-xs text-muted-foreground">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
