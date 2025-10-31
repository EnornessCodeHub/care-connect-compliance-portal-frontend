/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from '@/lib/axios';

export interface LoginRequest {
  email: string; // Can be email or username
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    role: 'admin' | 'staff';
    fullname: string | null;
    username: string;
    email: string;
    profile_img: string | null;
    status: boolean;
    token: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string; // For development/testing
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

class AuthService {
  /**
   * Login user with email/username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const data = response.data;

    // Store token in localStorage
    if (data.data?.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data));
    }

    return data;
  }

  /**
   * Send OTP for password reset
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', request);
    return response.data;
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await api.post<VerifyOTPResponse>('/auth/verify-otp', request);
    return response.data;
  }

  /**
   * Reset password
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', request);
    return response.data;
  }

  /**
   * Logout user
   * Clears authentication token and user data from localStorage
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Also clear any other session data if needed
    sessionStorage.clear();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get stored user data
   */
  getUserData(): LoginResponse['data'] | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'admin';
  }

  /**
   * Check if user has staff role
   */
  isStaff(): boolean {
    const user = this.getUserData();
    return user?.role === 'staff';
  }
}

export default new AuthService();

