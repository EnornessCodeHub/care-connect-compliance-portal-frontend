import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Bot, 
  Bell, 
  MessageSquare, 
  Users, 
  GraduationCap, 
  FileText, 
  CheckSquare,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    id: 'dashboard',
    title: '3.1 Dashboard & Navigation',
    description: 'Personalized user profiles with role-based permissions, quick links to core modules, and unified dashboard view',
    icon: LayoutDashboard,
    color: 'bg-blue-500',
    status: 'completed',
    route: '/',
    highlights: [
      'Role-based access control',
      'Personalized dashboard layout',
      'Quick links to core modules',
      'Real-time notifications panel',
      'Pending tasks tracking'
    ]
  },
  {
    id: 'staff-management',
    title: '3.2 Staff Management',
    description: 'Digital staff onboarding checklists, job descriptions repository, performance appraisal workflows, and risk assessment guides',
    icon: Users,
    color: 'bg-green-500',
    status: 'completed',
    route: '/staff/onboarding',
    highlights: [
      'Digital onboarding checklists',
      'Performance appraisal system',
      'Risk assessment integration',
      'Staff progress tracking',
      'Compliance verification'
    ]
  },
  {
    id: 'training',
    title: '3.3 Courses & Training',
    description: 'Interactive training modules, progress dashboards, and automated certificate generation',
    icon: GraduationCap,
    color: 'bg-purple-500',
    status: 'completed',
    route: '/training',
    highlights: [
      'Interactive training modules',
      'Progress tracking dashboard',
      'Automated certificates',
      'Course categorization',
      'Completion analytics'
    ]
  },
  {
    id: 'documents',
    title: '3.4 Document Center',
    description: 'Repository of compliance templates, HR forms, with categorization, version control, and advanced search',
    icon: FileText,
    color: 'bg-orange-500',
    status: 'completed',
    route: '/documents/templates',
    highlights: [
      'Template repository',
      'Version control system',
      'Advanced search & filters',
      'Document categorization',
      'Download tracking'
    ]
  },
  {
    id: 'form-builder',
    title: '3.5 Form Builder & E-Signature',
    description: 'Drag-and-drop form builder with configurable fields and secure email workflow',
    icon: CheckSquare,
    color: 'bg-red-500',
    status: 'completed',
    route: '/forms/create',
    highlights: [
      'Drag-and-drop builder',
      'Configurable field types',
      'E-signature integration',
      'Internal/external designation',
      'Secure email workflow'
    ]
  },
  {
    id: 'collaboration',
    title: '3.6 Notifications & Collaboration',
    description: 'Push notifications, internal chat system, and community discussion board',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    status: 'completed',
    route: '/chat',
    highlights: [
      'Real-time notifications',
      'Internal chat system',
      'Community discussion board',
      'File sharing capabilities',
      'Team collaboration tools'
    ]
  },
  {
    id: 'nado-ai',
    title: '3.7 NADO AI Assistant',
    description: 'AI-powered assistant with 24/7 guidance, compliance support, and task automation',
    icon: Bot,
    color: 'bg-cyan-500',
    status: 'completed',
    route: '/nado',
    highlights: [
      '24/7 AI assistance',
      'Compliance guidance',
      'Task automation',
      'Natural language processing',
      'Context-aware responses'
    ]
  }
];

export default function FeatureShowcase() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CareConnect Compliance Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive compliance management platform with AI-powered assistance, 
            staff management, training systems, and collaborative tools
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              7/7 Features Completed
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Production Ready
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Features:</h4>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    onClick={() => navigate(feature.route)}
                  >
                    Explore Feature
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Panel */}
        <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/')}
              >
                <LayoutDashboard className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/nado')}
              >
                <Bot className="h-6 w-6" />
                <span className="text-sm">NADO AI</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Chat</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/training')}
              >
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm">Training</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="text-sm text-muted-foreground">Core Features</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">25+</div>
                <div className="text-sm text-muted-foreground">Pages & Components</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-muted-foreground">Requirements Met</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
