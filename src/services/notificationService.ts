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
  attachment_link?: string; // External URL
  attachment_file?: File | string; // File object or base64 string
  attachment_file_name?: string; // Original file name
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
  attachment_link?: string; // External URL
  attachment_file?: string; // File URL or path
  attachment_file_name?: string; // Original file name
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
    // If there's a file attachment or link, use FormData
    const hasFile = data.attachment_file instanceof File;
    const hasLink = !!(data.attachment_link && data.attachment_link.trim());
    
    if (hasFile || hasLink) {
      const formData = new FormData();
      formData.append('user_ids', JSON.stringify(data.user_ids));
      formData.append('title', data.title);
      formData.append('message', data.message);
      
      if (data.attachment_link && data.attachment_link.trim()) {
        formData.append('attachment_link', data.attachment_link.trim());
      }
      
      if (data.attachment_file instanceof File) {
        formData.append('attachment_file', data.attachment_file);
        if (data.attachment_file_name) {
          formData.append('attachment_file_name', data.attachment_file_name);
        } else {
          formData.append('attachment_file_name', data.attachment_file.name);
        }
      } else if (typeof data.attachment_file === 'string') {
        // If it's a base64 string
        formData.append('attachment_file', data.attachment_file);
        if (data.attachment_file_name) {
          formData.append('attachment_file_name', data.attachment_file_name);
        }
      }
      
      // Don't set Content-Type header - let browser set it automatically with boundary
      // Axios will detect FormData and handle it properly
      const response = await api.post<NotificationResponse>('/notifications', formData);
      return response.data;
    }
    
    // For regular JSON request (no file or link)
    const response = await api.post<NotificationResponse>('/notifications', {
      user_ids: data.user_ids,
      title: data.title,
      message: data.message,
      attachment_link: data.attachment_link
    });
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

