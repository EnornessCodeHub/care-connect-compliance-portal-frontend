import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import staffService, { Staff } from '@/services/staffService';
import chatService, { ChatRoom, ChatMessage as ChatMessageType } from '@/services/chatService';
import chatSocketService from '@/services/chatSocketService';
import authService from '@/services/authService';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Search,
  Paperclip,
  UserPlus,
  X,
  Loader2,
  Trash2,
  File,
  Image as ImageIcon,
  Download
} from 'lucide-react';

export default function InternalChat() {
  const { toast } = useToast();
  const currentUser = authService.getUserData();
  const currentUserId = currentUser?.id || 0;
  
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Request cancellation for preventing duplicate calls
  const messageLoadControllerRef = useRef<AbortController | null>(null);
  const messagesCache = useRef<Map<number, { messages: ChatMessageType[]; timestamp: number }>>(new Map());
  const lastRoomSwitchRef = useRef<number | null>(null);
  
  // Loading states
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Create Group Dialog State
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  
  // New Chat Dialog State
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [loadingStaffForChat, setLoadingStaffForChat] = useState(false);
  const [staffListForChat, setStaffListForChat] = useState<Staff[]>([]);
  const [creatingChat, setCreatingChat] = useState(false);
  
  // Online users tracking
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load rooms on mount
  const loadRooms = useCallback(async () => {
    try {
      setLoadingRooms(true);
      const response = await chatService.getAllRooms();
      if (response.success && response.data) {
        setRooms(response.data);
        // Select first room if none selected
        if (!selectedRoom && response.data.length > 0) {
          setSelectedRoom(response.data[0]);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load chat rooms"
      });
    } finally {
      setLoadingRooms(false);
    }
  }, [selectedRoom, toast]);

  // Load messages for selected room
  const loadMessages = useCallback(async (roomId: number, skipCache: boolean = false) => {
    // Cancel previous request if still pending
    if (messageLoadControllerRef.current) {
      messageLoadControllerRef.current.abort();
    }
    
    // Check cache (use cached messages if less than 30 seconds old)
    if (!skipCache) {
      const cached = messagesCache.current.get(roomId);
      if (cached && Date.now() - cached.timestamp < 30000) {
        setMessages(cached.messages);
        // Mark as read in background without blocking
        chatService.markAsRead(roomId).catch(() => {
          // Silently fail - not critical
        });
        return;
      }
    }
    
    // Create new abort controller for this request
    messageLoadControllerRef.current = new AbortController();
    const signal = messageLoadControllerRef.current.signal;
    
    try {
      setLoadingMessages(true);
      const response = await chatService.getMessages(roomId, 1, 50, signal);
      if (response.success && response.data) {
        setMessages(response.data.messages);
        // Cache the messages
        messagesCache.current.set(roomId, {
          messages: response.data.messages,
          timestamp: Date.now()
        });
        // Mark messages as read in background (non-blocking)
        chatService.markAsRead(roomId).catch(() => {
          // Silently fail - not critical
        });
      }
    } catch (error: any) {
      // Don't show error if request was aborted
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load messages"
      });
    } finally {
      setLoadingMessages(false);
    }
  }, [toast]);

  // Initialize Socket.IO connection
  useEffect(() => {
    try {
      chatSocketService.connect();
    } catch (error) {
      console.error('Failed to connect Socket.IO:', error);
      // Don't block the UI if Socket.IO fails
    }

    // Listen for new messages
    const handleNewMessage = (message: ChatMessageType) => {
      // Add message to current room if it's the selected room
      if (selectedRoom) {
        setMessages(prevMessages => {
          // Check if message already exists (avoid duplicates)
          if (prevMessages.find(m => m.id === message.id)) {
            return prevMessages;
          }
          const newMessages = [...prevMessages, message];
          // Update cache
          messagesCache.current.set(selectedRoom.id, {
            messages: newMessages,
            timestamp: Date.now()
          });
          return newMessages;
        });
      }
      
      // Update room's last message for all rooms
      setRooms(prev => prev.map(room => {
        // For the selected room, update last message
        if (selectedRoom && room.id === selectedRoom.id) {
          return { ...room, lastMessage: message };
        }
        // For other rooms, update unread count if not from current user
        if (message.senderId !== currentUserId) {
          return { ...room, unreadCount: room.unreadCount + 1, lastMessage: message };
        }
        return room;
      }));
    };

    // Listen for typing indicators
    const handleTypingStarted = (data: { roomId: number; userId: number }) => {
      if (selectedRoom && data.roomId === selectedRoom.id && data.userId !== currentUserId) {
        setTypingUsers(prev => new Set(prev).add(data.userId));
      }
    };

    const handleTypingStopped = (data: { roomId: number; userId: number }) => {
      if (selectedRoom && data.roomId === selectedRoom.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    };

    // Listen for room updates
    const handleRoomUpdated = (data: { roomId: number; name?: string; avatar?: string }) => {
      setRooms(prev => prev.map(room => 
        room.id === data.roomId 
          ? { ...room, ...data }
          : room
      ));
    };

    // Listen for room deletion
    const handleRoomDeleted = (data: { roomId: number }) => {
      setRooms(prev => prev.filter(room => room.id !== data.roomId));
      if (selectedRoom?.id === data.roomId) {
        setSelectedRoom(null);
        setMessages([]);
      }
    };

    // Listen for user online/offline
    const handleUserOnline = (data: { userId: number }) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: number }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    chatSocketService.on('message:new', handleNewMessage);
    chatSocketService.on('typing:started', handleTypingStarted);
    chatSocketService.on('typing:stopped', handleTypingStopped);
    chatSocketService.on('room:updated', handleRoomUpdated);
    chatSocketService.on('room:deleted', handleRoomDeleted);
    chatSocketService.on('user:online', handleUserOnline);
    chatSocketService.on('user:offline', handleUserOffline);

    return () => {
      chatSocketService.off('message:new', handleNewMessage);
      chatSocketService.off('typing:started', handleTypingStarted);
      chatSocketService.off('typing:stopped', handleTypingStopped);
      chatSocketService.off('room:updated', handleRoomUpdated);
      chatSocketService.off('room:deleted', handleRoomDeleted);
      chatSocketService.off('user:online', handleUserOnline);
      chatSocketService.off('user:offline', handleUserOffline);
      chatSocketService.disconnect();
    };
  }, [selectedRoom, currentUserId]);

  // Load rooms on mount
  useEffect(() => {
    loadRooms().catch((error) => {
      console.error('Failed to load rooms:', error);
      setLoadingRooms(false);
    });
  }, [loadRooms]);

  // Load messages when room is selected (with debounce to prevent rapid switches)
  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }
    
    const roomId = selectedRoom.id;
    
    // Prevent rapid room switches - ignore if same room
    if (lastRoomSwitchRef.current === roomId) {
      return;
    }
    
    lastRoomSwitchRef.current = roomId;
    
    // Debounce room switching to prevent rapid API calls
    const timeoutId = setTimeout(() => {
      loadMessages(roomId).catch((error) => {
        console.error('Failed to load messages:', error);
      });
      
      try {
        chatSocketService.joinRoom(roomId);
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    }, 100); // 100ms debounce
    
    return () => {
      clearTimeout(timeoutId);
      // Cancel pending request
      if (messageLoadControllerRef.current) {
        messageLoadControllerRef.current.abort();
      }
      // Leave room on cleanup
      if (roomId) {
        try {
          chatSocketService.leaveRoom(roomId);
        } catch (error) {
          console.error('Failed to leave room:', error);
        }
      }
    };
  }, [selectedRoom?.id, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        // Filter out current user
        setStaffList(response.data.filter(s => s.id !== currentUserId));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff list"
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadStaffListForChat = useCallback(async () => {
    try {
      setLoadingStaffForChat(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        // Filter out current user and filter out staff that already have direct message rooms
        const otherStaff = response.data.filter(s => s.id !== currentUserId);
        // Filter out staff that already have direct message rooms with current user
        const existingDirectRooms = rooms.filter(r => r.type === 'direct');
        const existingStaffIds = new Set(
          existingDirectRooms.flatMap(room => 
            room.participants.filter(p => p.id !== currentUserId).map(p => p.id)
          )
        );
        setStaffListForChat(otherStaff.filter(s => !existingStaffIds.has(s.id)));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff list"
      });
    } finally {
      setLoadingStaffForChat(false);
    }
  }, [rooms, currentUserId, toast]);

  // Load staff list when create group dialog opens
  useEffect(() => {
    if (isCreateGroupOpen && staffList.length === 0) {
      loadStaffList();
    }
  }, [isCreateGroupOpen]);

  // Load staff list when new chat dialog opens
  useEffect(() => {
    if (isNewChatOpen) {
      loadStaffListForChat();
    }
  }, [isNewChatOpen, loadStaffListForChat]);

  const toggleStaff = (staffId: number) => {
    setSelectedStaffIds(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId) 
        : [...prev, staffId]
    );
  };

  const getSelectedStaffLabel = () => {
    if (selectedStaffIds.length === 0) return 'Select staff members';
    if (selectedStaffIds.length === 1) {
      const staff = staffList.find(s => s.id === selectedStaffIds[0]);
      return staff?.fullname || staff?.username || '1 staff member';
    }
    return `${selectedStaffIds.length} staff members selected`;
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Group name is required"
      });
      return;
    }

    if (selectedStaffIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one staff member"
      });
      return;
    }

    try {
      setCreatingGroup(true);
      const response = await chatService.createRoom({
        name: groupName.trim(),
        type: 'group',
        user_ids: selectedStaffIds
      });

      if (response.success && response.data) {
        // Use the response data to construct the room object
        const newRoom: ChatRoom = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          avatar: response.data.avatar || null,
          unreadCount: 0,
          participants: response.data.participants,
          lastMessage: undefined
        };
        
        // Add the new room to the rooms list and select it
        setRooms(prev => [newRoom, ...prev]);
        setSelectedRoom(newRoom);
        
        // Reset form
        setGroupName('');
        setSelectedStaffIds([]);
        setIsCreateGroupOpen(false);

        toast({
          title: "Success",
          description: `Group "${response.data.name}" created successfully`
        });
        
        // Refresh rooms list in the background (optional, for consistency)
        setTimeout(() => {
          loadRooms().catch(() => {
            // Silently fail - we already have the room
          });
        }, 500);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create group"
      });
    } finally {
      setCreatingGroup(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Only images (JPG, PNG, GIF, WEBP), PDF, and Word documents (DOC, DOCX) are allowed"
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "File size must be less than 5MB"
      });
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSendMessage = async () => {
    if (!selectedRoom || sendingMessage || uploadingFile) return;
    
    // Must have either message content or a file
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setSendingMessage(true);
      setUploadingFile(!!selectedFile);

      let messageType: 'text' | 'image' | 'file' = 'text';
      let fileBase64: string | undefined;
      let fileName: string | undefined;
      let fileSize: number | undefined;

      if (selectedFile) {
        // Determine message type
        if (selectedFile.type.startsWith('image/')) {
          messageType = 'image';
        } else {
          messageType = 'file';
        }

        // Convert file to base64
        fileBase64 = await fileToBase64(selectedFile);
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
      }

      const response = await chatService.sendMessage(selectedRoom.id, {
        content: newMessage.trim() || (selectedFile ? `Sent ${selectedFile.name}` : ''),
        type: messageType,
        file: fileBase64,
        file_name: fileName || null,
        file_size: fileSize || null
      });

      if (response.success && response.data) {
        // Add message to list optimistically
        setMessages(prev => {
          // Check if message already exists (avoid duplicates from Socket.IO)
          if (prev.find(m => m.id === response.data.id)) {
            return prev;
          }
          return [...prev, response.data];
        });
        
        // Clear input and file
        setNewMessage('');
        setSelectedFile(null);
        setFilePreview(null);
        chatSocketService.stopTyping(selectedRoom.id);
        
        // Update cache
        messagesCache.current.set(selectedRoom.id, {
          messages: [...messages, response.data],
          timestamp: Date.now()
        });
        
        // Update room's last message
        setRooms(prev => prev.map(room => 
          room.id === selectedRoom.id 
            ? { ...room, lastMessage: response.data, unreadCount: 0 }
            : room
        ));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message"
      });
    } finally {
      setSendingMessage(false);
      setUploadingFile(false);
    }
  };

  const handleNewChat = async () => {
    if (!selectedStaffId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a staff member"
      });
      return;
    }

    try {
      setCreatingChat(true);
      
      // Get the selected staff member's name for the room
      const selectedStaff = staffListForChat.find(s => s.id === selectedStaffId);
      const staffName = selectedStaff?.fullname || selectedStaff?.username || 'Staff Member';
      
      const response = await chatService.createRoom({
        name: `${currentUser?.fullname || currentUser?.username || 'User'}_${staffName}`, // Temporary name, backend will handle it
        type: 'direct',
        user_ids: [selectedStaffId]
      });

      if (response.success && response.data) {
        // Use the response data to construct the room object
        const newRoom: ChatRoom = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          avatar: response.data.avatar || null,
          unreadCount: 0,
          participants: response.data.participants,
          lastMessage: undefined
        };
        
        // Add the new room to the rooms list and select it
        setRooms(prev => [newRoom, ...prev]);
        setSelectedRoom(newRoom);
        
        // Reset form
        setSelectedStaffId(null);
        setIsNewChatOpen(false);

        toast({
          title: "Success",
          description: "Chat created successfully"
        });
        
        // Refresh rooms list in the background (optional, for consistency)
        setTimeout(() => {
          loadRooms().catch(() => {
            // Silently fail - we already have the room
          });
        }, 500);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create chat"
      });
    } finally {
      setCreatingChat(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom || selectedRoom.type === 'direct') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot delete direct message rooms"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${selectedRoom.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await chatService.deleteRoom(selectedRoom.id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Room deleted successfully"
        });
        // Refresh rooms and clear selection
        await loadRooms();
        setSelectedRoom(null);
        setMessages([]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete room"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTypingChange = (value: string) => {
    setNewMessage(value);
    if (selectedRoom) {
      if (value.length > 0) {
        chatSocketService.startTyping(selectedRoom.id);
      } else {
        chatSocketService.stopTyping(selectedRoom.id);
      }
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const isUserOnline = (userId: number) => {
    return onlineUsers.has(userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Internal Chat
            </h1>
            <p className="text-muted-foreground mt-1">
              Team collaboration and communication platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            {authService.isAdmin() && (
              <>
                <Button variant="outline" onClick={() => setIsNewChatOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button onClick={() => setIsCreateGroupOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] min-h-0">
          {/* Sidebar - Chat Rooms */}
          <div className="lg:col-span-1 min-w-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4">
                    {loadingRooms ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredRooms.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No conversations found
                      </div>
                    ) : (
                      filteredRooms.map((room) => {
                        const otherParticipant = room.type === 'direct' 
                          ? room.participants.find(p => p.id !== currentUserId)
                          : null;
                        return (
                          <div
                            key={room.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                              selectedRoom?.id === room.id ? 'bg-primary/10 border border-primary/20' : ''
                            }`}
                            onClick={() => setSelectedRoom(room)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                {room.type === 'direct' && otherParticipant && (
                                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                                    isUserOnline(otherParticipant.id) ? 'bg-green-500' : 'bg-gray-400'
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-medium text-sm break-words flex-1 min-w-0">
                                    {room.name}
                                  </h4>
                                  {room.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                                      {room.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                {room.lastMessage && (
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground break-words leading-relaxed">
                                      <span className="font-medium">{room.lastMessage.senderName}:</span>{' '}
                                      {room.lastMessage.content || (room.lastMessage.type === 'image' ? 'Sent an image' : room.lastMessage.type === 'file' ? `Sent ${room.lastMessage.fileName || 'a file'}` : '')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatTime(room.lastMessage.timestamp)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedRoom.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedRoom.type === 'direct' ? 'Direct message' : 
                             selectedRoom.type === 'group' ? `${selectedRoom.participants.length} members` :
                             `${selectedRoom.participants.length} members`}
                          </p>
                        </div>
                      </div>
                      {selectedRoom.type !== 'direct' && authService.isAdmin() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteRoom}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No messages yet. Start the conversation!
                          </div>
                        ) : (
                          <>
                            {messages.map((message) => {
                              const isCurrentUser = message.senderId === currentUserId;
                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                    {!isCurrentUser && (
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">
                                          {message.senderName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatTime(message.timestamp)}
                                        </span>
                                      </div>
                                    )}
                                    <div
                                      className={`p-3 rounded-lg ${
                                        isCurrentUser
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted'
                                      }`}
                                    >
                                      {message.replyTo && (
                                        <div className={`mb-2 pb-2 border-b ${
                                          isCurrentUser ? 'border-primary-foreground/20' : 'border-muted-foreground/20'
                                        }`}>
                                          <p className="text-xs opacity-75">
                                            Replying to {message.replyTo.senderName}
                                          </p>
                                          <p className="text-xs opacity-60 truncate">
                                            {message.replyTo.content}
                                          </p>
                                        </div>
                                      )}
                                      {message.content && (
                                        <p className="text-sm whitespace-pre-wrap mb-2">{message.content}</p>
                                      )}
                                      
                                      {/* File/Image Attachment */}
                                      {message.fileUrl && (
                                        <div className="mt-2">
                                          {message.type === 'image' ? (
                                            <div className="rounded-lg overflow-hidden max-w-sm">
                                              <img 
                                                src={message.fileUrl} 
                                                alt={message.fileName || 'Image'} 
                                                className="max-w-full h-auto cursor-pointer rounded"
                                                onClick={() => window.open(message.fileUrl || '', '_blank')}
                                              />
                                            </div>
                                          ) : (
                                            <a
                                              href={message.fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center gap-2 p-2 rounded-lg border ${
                                                isCurrentUser 
                                                  ? 'bg-primary-foreground/10 border-primary-foreground/20' 
                                                  : 'bg-background border-border'
                                              } hover:opacity-80 transition-opacity`}
                                            >
                                              <File className="h-4 w-4" />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">
                                                  {message.fileName || 'File'}
                                                </p>
                                                {message.fileSize && (
                                                  <p className="text-xs opacity-75">
                                                    {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                                                  </p>
                                                )}
                                              </div>
                                              <Download className="h-4 w-4" />
                                            </a>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {isCurrentUser && (
                                      <div className="flex justify-end mt-1">
                                        <span className="text-xs text-muted-foreground">
                                          {formatTime(message.timestamp)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {typingUsers.size > 0 && (
                              <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-lg">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    {/* File Preview */}
                    {selectedFile && (
                      <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {filePreview ? (
                            <img 
                              src={filePreview} 
                              alt="Preview" 
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                              <File className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sendingMessage || uploadingFile}
                        title="Attach file (Images, PDF, Word)"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          value={newMessage}
                          onChange={(e) => handleTypingChange(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          disabled={sendingMessage || uploadingFile}
                        />
                      </div>
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={(!newMessage.trim() && !selectedFile) || sendingMessage || uploadingFile}
                      >
                        {sendingMessage || uploadingFile ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Create Group Dialog */}
        <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
              <DialogDescription>
                Create a new group chat and add team members to collaborate.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={creatingGroup}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Add Members</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="justify-between w-full max-w-md"
                      disabled={loadingStaff || creatingGroup}
                    >
                      {loadingStaff ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading staff...
                        </>
                      ) : (
                        getSelectedStaffLabel()
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80">
                    {loadingStaff ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading staff...
                      </div>
                    ) : staffList.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        No staff members found
                      </div>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-auto pr-1">
                          {staffList.map(staff => {
                            const active = selectedStaffIds.includes(staff.id);
                            return (
                              <button
                                key={staff.id}
                                type="button"
                                onClick={() => toggleStaff(staff.id)}
                                disabled={creatingGroup}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors',
                                  active && 'bg-primary/10'
                                )}
                              >
                                <div className="font-medium">{staff.fullname || staff.username}</div>
                                <div className="text-xs text-muted-foreground">{staff.email}</div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </PopoverContent>
                </Popover>
                {selectedStaffIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStaffIds.map(id => {
                      const staff = staffList.find(s => s.id === id);
                      if (!staff) return null;
                      return (
                        <div key={id} className="px-3 py-1.5 bg-muted rounded-md text-sm flex items-center gap-2">
                          <span>{staff.fullname || staff.username}</span>
                          <button 
                            className="text-xs text-muted-foreground hover:text-destructive" 
                            onClick={() => toggleStaff(id)}
                            disabled={creatingGroup}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateGroupOpen(false);
                  setGroupName('');
                  setSelectedStaffIds([]);
                }}
                disabled={creatingGroup}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGroup}
                disabled={creatingGroup || !groupName.trim() || selectedStaffIds.length === 0}
              >
                {creatingGroup ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Group
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Chat Dialog */}
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Chat</DialogTitle>
              <DialogDescription>
                Start a new conversation with a staff member.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Select Staff Member</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="justify-between w-full max-w-md"
                      disabled={loadingStaffForChat || creatingChat}
                    >
                      {loadingStaffForChat ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading staff...
                        </>
                      ) : selectedStaffId ? (
                        (() => {
                          const staff = staffListForChat.find(s => s.id === selectedStaffId);
                          return staff ? (staff.fullname || staff.username) : 'Select staff member';
                        })()
                      ) : (
                        'Select staff member'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80">
                    {loadingStaffForChat ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading staff...
                      </div>
                    ) : staffListForChat.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        {rooms.filter(r => r.type === 'direct').length > 0 
                          ? 'All staff members already have active chats' 
                          : 'No staff members found'}
                      </div>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-auto pr-1">
                          {staffListForChat.map(staff => {
                            const active = selectedStaffId === staff.id;
                            return (
                              <button
                                key={staff.id}
                                type="button"
                                onClick={() => setSelectedStaffId(staff.id)}
                                disabled={creatingChat}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors',
                                  active && 'bg-primary/10'
                                )}
                              >
                                <div className="font-medium">{staff.fullname || staff.username}</div>
                                <div className="text-xs text-muted-foreground">{staff.email}</div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </PopoverContent>
                </Popover>
                {selectedStaffId && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-3 py-1.5 bg-muted rounded-md text-sm flex items-center gap-2">
                      <span>
                        {(() => {
                          const staff = staffListForChat.find(s => s.id === selectedStaffId);
                          return staff ? (staff.fullname || staff.username) : '';
                        })()}
                      </span>
                      <button 
                        className="text-xs text-muted-foreground hover:text-destructive" 
                        onClick={() => setSelectedStaffId(null)}
                        disabled={creatingChat}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewChatOpen(false);
                  setSelectedStaffId(null);
                }}
                disabled={creatingChat}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleNewChat}
                disabled={creatingChat || !selectedStaffId}
              >
                {creatingChat ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
