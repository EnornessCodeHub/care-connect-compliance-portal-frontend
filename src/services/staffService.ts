/**
 * Staff Management Service
 * Handles all staff-related API calls
 */

import api from '@/lib/axios';

export interface Staff {
  id: number;
  role: 'staff';
  fullname: string | null;
  username: string;
  email: string;
  profile_img: string | null;
  status: boolean;
  otp: string | null;
  firebase_user_id: string | null;
}

export interface CreateStaffRequest {
  fullname?: string;
  username: string;
  email: string;
  password: string;
  profile_img?: string;
  status?: number;
}

export interface UpdateStaffRequest {
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  profile_img?: string;
  status?: number;
}

export interface StaffResponse {
  success: boolean;
  message: string;
  data?: Staff;
}

export interface StaffListResponse {
  success: boolean;
  message: string;
  data?: Staff[];
}

class StaffService {
  /**
   * Create new staff member
   */
  async createStaff(data: CreateStaffRequest): Promise<StaffResponse> {
    const response = await api.post<StaffResponse>('/staff', data);
    return response.data;
  }

  /**
   * Get all staff members
   */
  async listStaff(): Promise<StaffListResponse> {
    const response = await api.get<StaffListResponse>('/staff');
    return response.data;
  }

  /**
   * Get staff by ID
   */
  async getStaffById(id: number): Promise<StaffResponse> {
    const response = await api.get<StaffResponse>(`/staff/${id}`);
    return response.data;
  }

  /**
   * Update staff member
   */
  async updateStaff(id: number, data: UpdateStaffRequest): Promise<StaffResponse> {
    const response = await api.put<StaffResponse>(`/staff/${id}`, data);
    return response.data;
  }

  /**
   * Toggle staff status (activate/block)
   */
  async toggleStaffStatus(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.patch<{ success: boolean; message: string }>(`/staff/${id}/toggle-status`);
    return response.data;
  }

  /**
   * Delete staff member (soft delete)
   */
  async deleteStaff(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/staff/${id}`);
    return response.data;
  }
}

export default new StaffService();

