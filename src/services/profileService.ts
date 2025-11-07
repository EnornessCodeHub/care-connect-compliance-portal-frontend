import api from '@/lib/axios';

export interface ProfileData {
  id: number;
  fullname: string | null;
  username: string;
  email: string;
  role: 'admin' | 'staff';
  profile_img: string | null;
  status: boolean;
}

export interface UpdateProfileRequest {
  fullname?: string;
  username?: string;
  email?: string;
  profile_img?: string;
}

export interface ChangePasswordRequest {
  password: string; // New password
}

class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<{
    success: boolean;
    message: string;
    data?: ProfileData;
  }> {
    const response = await api.get('/admin/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<{
    success: boolean;
    message: string;
    data?: ProfileData;
  }> {
    const response = await api.put('/admin/profile', data);
    return response.data;
  }

  /**
   * Change user password
   * Note: Backend only requires new password, not current password
   */
  async changePassword(newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post('/admin/change-password', {
      password: newPassword
    });
    return response.data;
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(base64Image: string): Promise<{
    success: boolean;
    message: string;
    data?: string; // URL or path to uploaded image
  }> {
    const response = await api.post('/admin/upload-profile-image', {
      profile_img: base64Image
    });
    return response.data;
  }
}

export default new ProfileService();

