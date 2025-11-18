/**
 * Admin Management Service
 * Handles all admin-related API calls
 */

import api from '@/lib/axios';

export interface Admin {
  id: number;
  role: 'admin';
  fullname: string | null;
  username: string;
  email: string;
  profile_img: string | null;
  status: boolean;
  otp: string | null;
  firebase_user_id: string | null;
}

export interface CreateAdminRequest {
  fullname?: string;
  username: string;
  email: string;
  password: string;
  profile_img?: string;
  status?: number;
}

export interface UpdateAdminRequest {
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  profile_img?: string;
  status?: number;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data?: Admin;
}

export interface AdminListResponse {
  success: boolean;
  message: string;
  data?: Admin[];
}

class AdminService {
  /**
   * Create new admin member
   */
  async createAdmin(data: CreateAdminRequest): Promise<AdminResponse> {
    const response = await api.post<AdminResponse>('/admin', data);
    return response.data;
  }

  /**
   * Get all admin members
   */
  async listAdmin(): Promise<AdminListResponse> {
    const response = await api.get<AdminListResponse>('/admin');
    return response.data;
  }

  /**
   * Get admin by ID
   */
  async getAdminById(id: number): Promise<AdminResponse> {
    const response = await api.get<AdminResponse>(`/admin/${id}`);
    return response.data;
  }

  /**
   * Update admin member
   */
  async updateAdmin(id: number, data: UpdateAdminRequest): Promise<AdminResponse> {
    const response = await api.put<AdminResponse>(`/admin/${id}`, data);
    return response.data;
  }

  /**
   * Toggle admin status (activate/block)
   */
  async toggleAdminStatus(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.patch<{ success: boolean; message: string }>(`/admin/${id}/toggle-status`);
    return response.data;
  }

  /**
   * Delete admin member (soft delete)
   */
  async deleteAdmin(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/${id}`);
    return response.data;
  }
}

export default new AdminService();

