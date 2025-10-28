import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Search,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  Bell,
  BellOff,
  Archive,
  Pin,
  Star,
  Trash2,
  Edit,
  Reply
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  isEdited?: boolean;
  replyTo?: string;
  reactions?: { emoji: string; users: string[] }[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
}

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Wilson', status: 'online' },
  { id: '2', name: 'Michael Chen', status: 'away' },
  { id: '3', name: 'Dr. Emma Thompson', status: 'online' },
  { id: '4', name: 'John Smith', status: 'busy' },
  { id: '5', name: 'Jennifer Lee', status: 'offline' }
];

const mockRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'General Discussion',
    type: 'channel',
    participants: ['1', '2', '3', '4', '5'],
    unreadCount: 3,
    isPinned: true,
    isArchived: false,
    lastMessage: {
      id: '1',
      content: 'Has anyone seen the new compliance updates?',
      senderId: '2',
      senderName: 'Michael Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  },
  {
    id: '2',
    name: 'Incident Response Team',
    type: 'group',
    participants: ['1', '3', '4'],
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    lastMessage: {
      id: '2',
      content: 'All clear on the incident from yesterday',
      senderId: '3',
      senderName: 'Dr. Emma Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  },
  {
    id: '3',
    name: 'Michael Chen',
    type: 'direct',
    participants: ['1', '2'],
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    lastMessage: {
      id: '3',
      content: 'Thanks for the help with the training module',
      senderId: '2',
      senderName: 'Michael Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
    }
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Good morning everyone! How is everyone doing today?',
    senderId: '1',
    senderName: 'Sarah Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: 'text'
  },
  {
    id: '2',
    content: 'Morning Sarah! All good here. Just working on the quarterly reports.',
    senderId: '2',
    senderName: 'Michael Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5),
    type: 'text'
  },
  {
    id: '3',
    content: 'Has anyone seen the new compliance updates?',
    senderId: '2',
    senderName: 'Michael Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text'
  },
  {
    id: '4',
    content: 'Yes, I reviewed them this morning. There are some important changes to incident reporting procedures.',
    senderId: '3',
    senderName: 'Dr. Emma Thompson',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'text'
  }
];

export default function InternalChat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockRooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: '1', // Current user
      senderName: 'You',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredRooms = mockRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar - Chat Rooms */}
          <div className="lg:col-span-1">
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
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                          selectedRoom?.id === room.id ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            {room.type === 'direct' && (
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(mockUsers.find(u => u.id === room.participants.find(p => p !== '1'))?.status || 'offline')}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{room.name}</h4>
                              {room.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>
                            {room.lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {room.lastMessage.senderName}: {room.lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {room.lastMessage ? formatTime(room.lastMessage.timestamp) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${message.senderId === '1' ? 'order-2' : 'order-1'}`}>
                              {message.senderId !== '1' && (
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
                                  message.senderId === '1'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              {message.senderId === '1' && (
                                <div className="flex justify-end mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
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
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            setIsTyping(e.target.value.length > 0);
                          }}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
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
      </div>
    </div>
  );
}
