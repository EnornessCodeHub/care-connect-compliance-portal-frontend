/**
 * Chat Service
 * Handles all chat-related API calls (rooms, messages)
 */

import api from '@/lib/axios';

// ===== Type Definitions =====

export interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'group' | 'channel';
  avatar?: string | null;
  unreadCount: number;
  lastMessage?: {
    id: number;
    content: string;
    senderId: number;
    senderName: string;
    timestamp: string;
  };
  participants: Array<{
    id: number;
    fullname: string;
    username: string;
    profile_img?: string | null;
  }>;
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string | null;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  replyTo?: {
    id: number;
    content: string;
    senderName: string;
  } | null;
}

export interface CreateRoomRequest {
  name: string;
  type: 'direct' | 'group' | 'channel';
  avatar?: string | null;
  user_ids: number[];
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    type: 'direct' | 'group' | 'channel';
    avatar?: string | null;
    created_by: number;
    participants: Array<{
      id: number;
      fullname: string;
      username: string;
      profile_img?: string | null;
    }>;
    created_at: string;
  };
}

export interface RoomsListResponse {
  success: boolean;
  message: string;
  data: ChatRoom[];
}

export interface RoomDetailsResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    type: 'direct' | 'group' | 'channel';
    avatar?: string | null;
    participants: Array<{
      id: number;
      fullname: string;
      username: string;
      profile_img?: string | null;
    }>;
    created_by: number;
    created_at: string;
  };
}

export interface UpdateRoomRequest {
  name?: string;
  avatar?: string | null;
}

export interface UpdateRoomResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    type: 'direct' | 'group' | 'channel';
    avatar?: string | null;
    participants: Array<{
      id: number;
      fullname: string;
      username: string;
      profile_img?: string | null;
    }>;
    created_by: number;
    created_at: string;
    updated_at: string;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendMessageRequest {
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  reply_to_id?: number | null;
  file?: string; // Base64 data URL for image/file
  file_name?: string | null;
  file_size?: number | null;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface AddParticipantsRequest {
  user_ids: number[];
}

export interface AddParticipantsResponse {
  success: boolean;
  message: string;
  data: {
    added: number;
  };
}

class ChatService {
  /**
   * Get all rooms for current user
   */
  async getAllRooms(): Promise<RoomsListResponse> {
    const response = await api.get<RoomsListResponse>('/chat/rooms');
    return response.data;
  }

  /**
   * Create a new room/group
   */
  async createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
    const response = await api.post<CreateRoomResponse>('/chat/rooms', data);
    return response.data;
  }

  /**
   * Get room details by ID
   */
  async getRoomById(roomId: number): Promise<RoomDetailsResponse> {
    const response = await api.get<RoomDetailsResponse>(`/chat/rooms/${roomId}`);
    return response.data;
  }

  /**
   * Update room (name, avatar)
   */
  async updateRoom(roomId: number, data: UpdateRoomRequest): Promise<UpdateRoomResponse> {
    const response = await api.put<UpdateRoomResponse>(`/chat/rooms/${roomId}`, data);
    return response.data;
  }

  /**
   * Delete room/group (creator only)
   */
  async deleteRoom(roomId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/chat/rooms/${roomId}`);
    return response.data;
  }

  /**
   * Add participants to room
   */
  async addParticipants(roomId: number, data: AddParticipantsRequest): Promise<AddParticipantsResponse> {
    const response = await api.post<AddParticipantsResponse>(`/chat/rooms/${roomId}/participants`, data);
    return response.data;
  }

  /**
   * Remove participant from room
   */
  async removeParticipant(roomId: number, userId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/chat/rooms/${roomId}/participants/${userId}`
    );
    return response.data;
  }

  /**
   * Get messages in a room (paginated)
   */
  async getMessages(roomId: number, page: number = 1, limit: number = 50, signal?: AbortSignal): Promise<MessagesResponse> {
    const response = await api.get<MessagesResponse>(`/chat/rooms/${roomId}/messages`, {
      params: { page, limit },
      signal, // Support request cancellation
    });
    return response.data;
  }

  /**
   * Send a message
   */
  async sendMessage(roomId: number, data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await api.post<SendMessageResponse>(`/chat/rooms/${roomId}/messages`, data);
    return response.data;
  }

  /**
   * Mark messages as read in a room
   */
  async markAsRead(roomId: number): Promise<MarkAsReadResponse> {
    const response = await api.post<MarkAsReadResponse>(`/chat/rooms/${roomId}/read`);
    return response.data;
  }
}

export default new ChatService();

