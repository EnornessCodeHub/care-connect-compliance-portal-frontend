export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  permissions: Permission[];
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // Higher number = more permissions
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface UserProfile {
  user: User;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  quickLinks: QuickLink[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  dashboardLayout: DashboardLayout;
}

export interface DashboardLayout {
  sections: DashboardSection[];
  widgets: DashboardWidget[];
}

export interface DashboardSection {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
  widgets: string[]; // Widget IDs
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    incidents: boolean;
    complaints: boolean;
    compliance: boolean;
    training: boolean;
    general: boolean;
  };
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  isVisible: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  isRead: boolean;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
}

export interface PendingTask {
  id: string;
  title: string;
  description: string;
  type: 'incident' | 'complaint' | 'compliance' | 'training' | 'approval';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}
