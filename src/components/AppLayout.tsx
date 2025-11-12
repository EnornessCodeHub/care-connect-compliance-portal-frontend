import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import authService from "@/services/authService";
import notificationService, { UserNotification } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Hide sidebar on FormBuilder page for full-width view
  const isFormBuilder = location.pathname === '/forms/create';
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load user data from localStorage
  useEffect(() => {
    const userData = authService.getUserData();
    if (userData) {
      setFullName(userData.fullname || userData.username);
      setEmail(userData.email);
      setProfileImage(userData.profile_img || null);
      // Load notifications when user data is available
      loadNotifications();
    }
  }, []);

  // Listen for profile image updates
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = authService.getUserData();
      if (userData) {
        setProfileImage(userData.profile_img || null);
        setFullName(userData.fullname || userData.username);
        setEmail(userData.email);
      }
    };

    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleStorageChange);
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const userData = authService.getUserData();
      if (!userData) return;

      const response = await notificationService.getNotificationsByUserId(userData.id);
      if (response.success && response.data) {
        // Get latest 6 notifications
        const latestNotifications = response.data.slice(0, 6);
        setNotifications(latestNotifications);
        
        // Count unread notifications
        const unread = response.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleLogout = () => {
    // Clear auth token and user data from localStorage
    authService.logout();
    
    // Show success notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <SidebarProvider defaultOpen={!isFormBuilder}>
      <div className="min-h-screen flex w-full">
        {!isFormBuilder && <AppSidebar />}
        <div className="flex-1 flex flex-col w-full">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center">
              {!isFormBuilder && <SidebarTrigger className="h-8 w-8" />}
              <div className={isFormBuilder ? "" : "ml-4"}>
                <h1 className="text-lg font-semibold">CareConnect</h1>
                <p className="text-xs text-muted-foreground">By Provider Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-md hover:bg-muted transition-colors" aria-label="Notifications">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 10V7a4 4 0 0 0-8 0v3a6 6 0 0 1-2 4h12a6 6 0 0 1-2-4"/><path d="M6 18a2 2 0 0 0 4 0"/></svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-0 max-h-[500px] overflow-hidden">
                  <div className="p-4 border-b font-semibold flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive">{unreadCount} new</Badge>
                    )}
                  </div>
                  
                  {loadingNotifications ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-sm text-muted-foreground">You have no notifications right now.</div>
                    </div>
                  ) : (
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to="/notifications/view"
                          className="block p-4 hover:bg-muted border-b transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {!notification.is_read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm mb-1 flex items-center gap-2">
                                {notification.title}
                                {!notification.is_read && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="p-3 border-t text-center text-sm bg-muted/50">
                    <Link to="/notifications/view" className="text-primary hover:underline font-medium">
                      View All Notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                    <span className="text-sm font-medium">{fullName}</span>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-none">{fullName}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}