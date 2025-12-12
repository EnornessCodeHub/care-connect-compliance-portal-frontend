import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  UserPlus,
  FileX,
  Clock,
  FileText,
  DollarSign,
  CreditCard,
  Plus,
  FolderOpen,
  ClipboardCheck,
  AlertTriangle,
  Ticket,
  MessageSquareWarning,
  BarChart3,
  Settings,
  ChevronDown,
  BookOpen,
  Navigation,
  Activity,
  Building,
  Home,
  Shield,
  Bot,
  Bell,
  GraduationCap,
  MessageSquare,
  CheckSquare,
  PenTool,
  Star
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import authService from '@/services/authService';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Feature Showcase",
  //   url: "/showcase",
  //   icon: Star,
  // },
  {
    title: "NADO AI Assistant",
    url: "/nado",
    icon: Bot,
  },
  {
    title: "Staff Management",
    url: "/staff",
    icon: Users,
  },
  {
    title: "Admin Management",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Internal Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  // {
  //   title: "Community Board",
  //   url: "/community",
  //   icon: Users,
  // },
  // trimmed legacy: Clients
  // trimmed legacy: SIL Services
  // trimmed legacy: SDA Management
  // trimmed legacy: Behaviour Support
  // trimmed legacy: Staff Tracking
  // trimmed legacy: Timesheets
  // trimmed legacy: Invoices
  {
    title: "Training & Courses",
    icon: GraduationCap,
    items: [
      { title: "My Courses", url: "/course" },
      { title: "Progress Dashboard", url: "/course/progress" },
      { title: "Certificates", url: "/course/certificates" },
    ],
  },
  {
    title: "Document Center",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "E-Signature Documents",
    icon: PenTool,
    items: [
      { title: "E-Sign Documents", url: "/forms" },
      { title: "Templates", url: "/forms/templates" },
    ],
  },
  {
    title: "Tracking & Reporting",
    url: "/course/report",
    icon: BarChart3,
  },
  // trimmed legacy: Incidents
  // trimmed legacy: Complaints
  // trimmed legacy: Reports
  // trimmed legacy: User Guide
  // trimmed legacy: Admin Management
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const collapsed = state === "collapsed";
  const isAdmin = authService.isAdmin();

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: { url: string }[]) => 
    items.some(item => currentPath === item.url);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(group => group !== title)
        : [...prev, title]
    );
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium border-r-2 border-primary shadow-sm" 
      : "text-foreground/80 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/2 hover:shadow-sm transition-all duration-200 ease-in-out";

  const getGroupClassName = (isGroupActive: boolean) =>
    isGroupActive
      ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-medium"
      : "text-foreground/80 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 ease-in-out";

  // Filter menu items based on role
  const filteredMenuItems = menuItems.filter(item => {
    if (!isAdmin) {
      // Hide Staff Management for staff
      if (item.title === "Staff Management") return false;
      
      // Hide Admin Management for staff
      if (item.title === "Admin Management") return false;
      
      // Hide Notifications for staff
      if (item.title === "Notifications") return false;

      // Hide Tracking & Reporting (master training report) for staff
      if (item.title === "Tracking & Reporting") return false;
    }
    return true;
  }).map(item => {
    // Filter submenu items for Training & Courses
    if (item.title === "Training & Courses" && item.items && !isAdmin) {
      return {
        ...item,
        items: item.items.filter(
          subItem => subItem.title !== "Progress Dashboard"
        )
      };
    }
    
    // Convert E-Signature Documents from dropdown to single link for staff
    if (item.title === "E-Signature Documents" && !isAdmin) {
      return {
        ...item,
        url: "/forms",
        items: undefined, // Remove items to make it a single link
      };
    }
    
    return item;
  });

  return (
    <Sidebar 
      className={`${collapsed ? "w-14" : "w-64"} border-r border-border/50 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm`} 
      collapsible="icon"
    >
      <SidebarContent className="relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <SidebarGroup className="relative">
          <SidebarGroupLabel className="text-sm font-bold text-foreground/70 tracking-wide uppercase mb-4 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMenuItems.map((item, index) => (
                <SidebarMenuItem 
                  key={item.title}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {item.items ? (
                    <Collapsible
                      open={openGroups.includes(item.title) || isGroupActive(item.items)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out hover-scale ${getGroupClassName(isGroupActive(item.items))}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-5 h-5">
                              <item.icon className="h-4 w-4" />
                            </div>
                            {!collapsed && (
                              <span className="font-medium tracking-wide">{item.title}</span>
                            )}
                          </div>
                          {!collapsed && (
                            <ChevronDown 
                              className={`h-4 w-4 transition-all duration-300 ease-out ${
                                openGroups.includes(item.title) || isGroupActive(item.items) 
                                  ? "rotate-180 text-primary" 
                                  : "text-foreground/60"
                              }`} 
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent className="animate-accordion-down">
                          <SidebarMenuSub className="ml-6 mt-2 space-y-1 border-l border-border/30 pl-4">
                            {item.items.map((subItem, subIndex) => (
                              <SidebarMenuSubItem 
                                key={subItem.title}
                                className="animate-fade-in"
                                style={{ 
                                  animationDelay: `${(index * 50) + (subIndex * 30) + 100}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url}
                                    className={({ isActive }) => `${getNavClassName({ isActive })} rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200 ease-in-out hover-scale relative overflow-hidden`}
                                  >
                                    <span className="relative z-10">{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url!}
                        className={({ isActive }) => `${getNavClassName({ isActive })} rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out hover-scale relative overflow-hidden group`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="flex items-center justify-center w-5 h-5">
                            <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                          </div>
                          {!collapsed && (
                            <span className="font-medium tracking-wide">{item.title}</span>
                          )}
                        </div>
                        {/* Subtle animated background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}