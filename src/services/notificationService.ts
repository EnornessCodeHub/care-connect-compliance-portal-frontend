/**
 * Notification Service
 * Handles all notification-related API calls
 */

import api from '@/lib/axios';

export interface NotificationRecipient {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  user_ids: number[];
  recipients?: NotificationRecipient[];
  status: 'sent' | 'draft';
  is_read?: { [userId: string]: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  user_ids: number[];
  title: string;
  message: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  count: number;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem;
}

export interface UserNotification {
  id: number;
  user_ids: number[];
  title: string;
  message: string;
  is_read: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotificationListResponse {
  success: boolean;
  message: string;
  data: UserNotification[];
  count: number;
}

export interface MarkAsReadRequest {
  userId: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

class NotificationService {
  /**
   * Get all notifications (Admin view with recipients)
   */
  async getAllNotifications(): Promise<NotificationListResponse> {
    const response = await api.get<NotificationListResponse>('/notifications');
    return response.data;
  }

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationRequest): Promise<NotificationResponse> {
    const response = await api.post<NotificationResponse>('/notifications', data);
    return response.data;
  }

  /**
   * Get notifications for a specific user
   */
  async getNotificationsByUserId(userId: number): Promise<UserNotificationListResponse> {
    const response = await api.get<UserNotificationListResponse>(`/notifications/user/${userId}`);
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number, userId: number): Promise<MarkAsReadResponse> {
    const response = await api.put<MarkAsReadResponse>(
      `/notifications/${notificationId}/read`,
      { userId }
    );
    return response.data;
  }
}

export default new NotificationService();

