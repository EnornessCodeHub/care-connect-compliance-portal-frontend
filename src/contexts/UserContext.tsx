import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile, UserRole, Permission, Notification, PendingTask } from '@/types/user';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  notifications: Notification[];
  pendingTasks: PendingTask[];
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markTaskAsComplete: (taskId: string) => void;
  refreshData: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for development
const mockUser: User = {
  id: '1',
  email: 'admin@careconnect.com',
  firstName: 'John',
  lastName: 'Doe',
  role: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: [],
    level: 10
  },
  avatar: '/avatars/admin.jpg',
  department: 'Management',
  permissions: [
    { id: '1', name: 'Read Users', resource: 'users', action: 'read', description: 'View user information' },
    { id: '2', name: 'Write Users', resource: 'users', action: 'write', description: 'Create and edit users' },
    { id: '3', name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete users' },
    { id: '4', name: 'Read Clients', resource: 'clients', action: 'read', description: 'View client information' },
    { id: '5', name: 'Write Clients', resource: 'clients', action: 'write', description: 'Create and edit clients' },
    { id: '6', name: 'Read Incidents', resource: 'incidents', action: 'read', description: 'View incident reports' },
    { id: '7', name: 'Write Incidents', resource: 'incidents', action: 'write', description: 'Create and edit incidents' },
    { id: '8', name: 'Read Complaints', resource: 'complaints', action: 'read', description: 'View complaints' },
    { id: '9', name: 'Write Complaints', resource: 'complaints', action: 'write', description: 'Create and edit complaints' },
    { id: '10', name: 'Read Documents', resource: 'documents', action: 'read', description: 'View documents' },
    { id: '11', name: 'Write Documents', resource: 'documents', action: 'write', description: 'Upload and edit documents' },
    { id: '12', name: 'Read Training', resource: 'training', action: 'read', description: 'View training modules' },
    { id: '13', name: 'Write Training', resource: 'training', action: 'write', description: 'Create and edit training' },
    { id: '14', name: 'Read Forms', resource: 'forms', action: 'read', description: 'View forms' },
    { id: '15', name: 'Write Forms', resource: 'forms', action: 'write', description: 'Create and edit forms' },
    { id: '16', name: 'Read Reports', resource: 'reports', action: 'read', description: 'View reports' },
    { id: '17', name: 'Write Reports', resource: 'reports', action: 'write', description: 'Generate reports' },
    { id: '18', name: 'Admin Access', resource: 'admin', action: 'all', description: 'Full administrative access' }
  ],
  lastLogin: new Date(),
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

const mockProfile: UserProfile = {
  user: mockUser,
  preferences: {
    theme: 'system',
    language: 'en',
    timezone: 'Australia/Sydney',
    dateFormat: 'DD/MM/YYYY',
    dashboardLayout: {
      sections: [
        {
          id: 'quick-alerts',
          title: 'Quick Alerts',
          order: 1,
          isVisible: true,
          widgets: ['new-incidents', 'new-complaints', 'high-risk-alerts']
        },
        {
          id: 'daily-operations',
          title: 'Daily Operations',
          order: 2,
          isVisible: true,
          widgets: ['late-checkins', 'staff-cancellations', 'shift-coverage']
        },
        {
          id: 'compliance',
          title: 'Compliance Tracking',
          order: 3,
          isVisible: true,
          widgets: ['expired-docs', 'overdue-tasks']
        }
      ],
      widgets: [
        {
          id: 'new-incidents',
          type: 'metric',
          title: 'New Incidents',
          size: 'small',
          position: { x: 0, y: 0 },
          config: { color: 'red', icon: 'AlertTriangle' }
        },
        {
          id: 'new-complaints',
          type: 'metric',
          title: 'New Complaints',
          size: 'small',
          position: { x: 1, y: 0 },
          config: { color: 'orange', icon: 'MessageSquareWarning' }
        }
      ]
    }
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    categories: {
      incidents: true,
      complaints: true,
      compliance: true,
      training: true,
      general: true
    }
  },
  quickLinks: [
    { id: '1', title: 'Portal', url: '/', icon: 'LayoutDashboard', order: 1, isVisible: true },
    { id: '2', title: 'NADO', url: '/nado', icon: 'Bot', order: 2, isVisible: true },
    { id: '3', title: 'Staff', url: '/team', icon: 'Users', order: 3, isVisible: true },
    { id: '4', title: 'Notifications', url: '/notifications', icon: 'Bell', order: 4, isVisible: true }
  ]
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Incident Report',
    message: 'A new incident has been reported requiring immediate attention.',
    type: 'warning',
    category: 'incidents',
    isRead: false,
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionUrl: '/incidents/tickets',
    actionText: 'View Incident'
  },
  {
    id: '2',
    title: 'Training Module Available',
    message: 'New compliance training module is now available for completion.',
    type: 'info',
    category: 'training',
    isRead: false,
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: '/training',
    actionText: 'Start Training'
  },
  {
    id: '3',
    title: 'Document Expiring Soon',
    message: 'Staff member John Smith\'s police check expires in 7 days.',
    type: 'warning',
    category: 'compliance',
    isRead: true,
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionUrl: '/documents',
    actionText: 'View Documents'
  }
];

const mockPendingTasks: PendingTask[] = [
  {
    id: '1',
    title: 'Review Incident Report #1234',
    description: 'Incident involving client safety requires review and approval.',
    type: 'incident',
    priority: 'high',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    assignedTo: '1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '2',
    title: 'Complete Compliance Training',
    description: 'Annual compliance training module must be completed.',
    type: 'training',
    priority: 'medium',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Next week
    assignedTo: '1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  },
  {
    id: '3',
    title: 'Approve Staff Leave Request',
    description: 'Sarah Johnson has requested 3 days leave next month.',
    type: 'approval',
    priority: 'low',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
    assignedTo: '1',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
];

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      setProfile(mockProfile);
      setNotifications(mockNotifications);
      setPendingTasks(mockPendingTasks);
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    return user.permissions.some(permission => 
      permission.resource === resource && 
      (permission.action === action || permission.action === 'all')
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    return user.role.name.toLowerCase() === roleName.toLowerCase();
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markTaskAsComplete = (taskId: string) => {
    setPendingTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const, updatedAt: new Date() }
          : task
      )
    );
  };

  const refreshData = () => {
    // Simulate data refresh
    setNotifications(mockNotifications);
    setPendingTasks(mockPendingTasks);
  };

  const value: UserContextType = {
    user,
    profile,
    notifications,
    pendingTasks,
    hasPermission,
    hasRole,
    updateProfile,
    markNotificationAsRead,
    markTaskAsComplete,
    refreshData,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
