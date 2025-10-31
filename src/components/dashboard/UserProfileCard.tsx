import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Shield,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export function UserProfileCard() {
  const { user, profile, notifications, pendingTasks, logout: contextLogout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user || !profile) return null;

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length;

  const handleLogout = () => {
    // Clear auth token and user data
    authService.logout();
    
    // Clear user context
    contextLogout();
    
    // Show success message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm border border-white/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            User Profile
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                {user.role.name}
              </Badge>
              {user.department && (
                <Badge variant="outline" className="text-xs">
                  {user.department}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Last login: {user.lastLogin ? formatDistanceToNow(user.lastLogin, { addSuffix: true }) : 'Never'}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{unreadNotifications}</div>
            <div className="text-xs text-muted-foreground">Unread Notifications</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{urgentTasks}</div>
            <div className="text-xs text-muted-foreground">Urgent Tasks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
