/**
 * Chat Socket Service
 * Manages Socket.IO connection and real-time events for chat
 */

import { io, Socket } from 'socket.io-client';
import authService from './authService';

// Socket.IO event types
export interface SocketMessage {
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

export interface TypingIndicator {
  roomId: number;
  userId: number;
}

export interface RoomUpdate {
  roomId: number;
  name?: string;
  avatar?: string | null;
  participants?: number;
  participantRemoved?: number;
}

export interface RoomDeleted {
  roomId: number;
}

export interface UserStatus {
  userId: number;
}

class ChatSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Connect to Socket.IO server
   */
  connect(): void {
    try {
      if (this.socket?.connected) {
        console.log('Socket already connected');
        return;
      }

      const token = authService.getToken();
      if (!token) {
        console.warn('No token available for Socket.IO connection');
        return;
      }

      const baseURL = import.meta.env.VITE_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3001';

      this.socket = io(baseURL, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 5000,
      });

      // Setup event handlers only if socket was created
      if (this.socket) {
        this.socket.on('connect', () => {
          console.log('Socket.IO connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Join all rooms user is part of
          this.joinRooms();

          // Re-attach event listeners
          this.reattachEventListeners();
        });

        this.socket.on('disconnect', () => {
          console.log('Socket.IO disconnected');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error);
          this.reconnectAttempts++;
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
          }
        });

        // Handle server events
        this.setupEventHandlers();
      }
    } catch (error) {
      console.error('Error connecting to Socket.IO:', error);
      // Don't throw - allow the app to continue without real-time features
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  /**
   * Join all rooms user is part of
   */
  joinRooms(): void {
    if (this.socket?.connected) {
      this.socket.emit('join:rooms');
    }
  }

  /**
   * Join a specific room
   */
  joinRoom(roomId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('join:room', roomId);
    }
  }

  /**
   * Leave a specific room
   */
  leaveRoom(roomId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('leave:room', roomId);
    }
  }

  /**
   * Send typing started indicator
   */
  startTyping(roomId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('typing:started', { roomId });
    }
  }

  /**
   * Send typing stopped indicator
   */
  stopTyping(roomId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('typing:stopped', { roomId });
    }
  }

  /**
   * Setup event handlers for server events
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // New message received
    this.socket.on('message:new', (message: SocketMessage) => {
      this.emit('message:new', message);
    });

    // Typing indicators
    this.socket.on('typing:started', (data: TypingIndicator) => {
      this.emit('typing:started', data);
    });

    this.socket.on('typing:stopped', (data: TypingIndicator) => {
      this.emit('typing:stopped', data);
    });

    // Room updates
    this.socket.on('room:updated', (data: RoomUpdate) => {
      this.emit('room:updated', data);
    });

    this.socket.on('room:deleted', (data: RoomDeleted) => {
      this.emit('room:deleted', data);
    });

    // User status
    this.socket.on('user:online', (data: UserStatus) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data: UserStatus) => {
      this.emit('user:offline', data);
    });

    // Error handling
    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket.IO error:', error);
      this.emit('error', error);
    });

    // Room joined confirmation
    this.socket.on('joined:room', (data: { roomId: number }) => {
      this.emit('joined:room', data);
    });
  }

  /**
   * Re-attach event listeners after reconnection
   */
  private reattachEventListeners(): void {
    // This method is called after reconnection
    // Event handlers are persistent on the socket, so no need to re-attach
    // But we can emit join:rooms again to ensure we're in all rooms
    this.joinRooms();
  }

  /**
   * Subscribe to an event
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback?: (data: any) => void): void {
    if (!callback) {
      // Remove all listeners for this event
      this.eventListeners.delete(event);
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Emit event to all registered listeners
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if socket is connected
   */
  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new ChatSocketService();

