import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Send,
  MessageSquare,
  Loader2,
  Eye,
  FileText,
  Paperclip,
  X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import authService from '@/services/authService';

interface Citation {
  documentId: string;
  displayName: string;
  category: string;
  filePath: string;
  fileType: string;
  similarity: number;
  source?: 'client' | 'global';
  viewUrl?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  isStreaming?: boolean;
  disclaimer?: string;
  citations?: Citation[];
  fileName?: string;
}

// Quick links removed

const suggestedQuestions = [
  "How do I create a new incident report?",
  "What are the NDIS compliance requirements?",
  "How do I set up staff onboarding?",
  "What training modules are available?",
  "How do I create a custom form?",
  "What are the latest policy updates?"
];

export default function NADOAssistant() {
  const { user } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${user?.firstName || 'there'}! I'm NADO, your AI assistant. I'm here to help you with compliance guidance, staff training, form creation, and navigating the CareConnect portal. How can I assist you today?`,
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sessionIdRef = useRef<string>('');

  const ensureSessionId = () => {
    if (!sessionIdRef.current) {
      sessionIdRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `session-${Date.now()}`;
    }
    return sessionIdRef.current;
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (file: File) => {
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error('Only PDF, DOC, and DOCX files are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file);
      setSelectedFile(file);
      // Pre-fill input with review message
      setInputValue('Review this document for compliance and quality');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: error.message || 'Unable to attach file.'
      });
      resetFileInput();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    resetFileInput();
    // Clear input when file is removed
    setInputValue('');
  };

  const handleSendMessage = async (content: string, attachmentOverride?: File | null) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isTyping) return;

    const attachment = attachmentOverride ?? selectedFile;

    if (attachment) {
      try {
        validateFile(attachment);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Invalid File',
          description: error.message || 'Unable to attach file.'
        });
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedContent,
      timestamp: new Date(),
      fileName: attachment?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setThinkingStatus('Connecting...');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Prepare conversation history for API
      const history = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const sessionId = ensureSessionId();
      const token = authService.getToken();

      let requestOptions: RequestInit;

      if (attachment) {
        const formData = new FormData();
        formData.append('message', trimmedContent);
        formData.append('attachment', attachment);
        formData.append('history', JSON.stringify(history));
        formData.append('timezone', timezone);
        formData.append('sessionId', sessionId);

        requestOptions = {
          method: 'POST',
          headers: {
            'x-access-token': token || ''
          },
          body: formData,
          signal: abortControllerRef.current.signal
        };

        setSelectedFile(null);
        resetFileInput();
      } else {
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token || ''
          },
          body: JSON.stringify({
            message: trimmedContent,
            history,
            sessionId,
            timezone
          }),
          signal: abortControllerRef.current.signal
        };
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/chat/stream`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let streamingMessageId = (Date.now() + 1).toString();
      let accumulatedContent = '';
      let messageDisclaimer = '';
      let messageCitations: Citation[] = [];
      let currentEvent = '';
      let streamingErrored = false;

      // Create initial streaming message
      const initialMessage: ChatMessage = {
        id: streamingMessageId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        category: 'response',
        isStreaming: true
      };
      setMessages(prev => [...prev, initialMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
            continue;
          }

          if (line.startsWith('data:')) {
            const dataStr = line.substring(5).trim();
            
            if (dataStr === '[DONE]') {
              setIsTyping(false);
              setThinkingStatus('');
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === streamingMessageId 
                    ? { 
                        ...msg, 
                        isStreaming: false, 
                        disclaimer: messageDisclaimer || undefined,
                        citations: messageCitations.length > 0 ? messageCitations : undefined
                      }
                    : msg
                )
              );
              continue;
            }

            try {
              const data = JSON.parse(dataStr);
              
              // PRIORITY: Handle token data first, regardless of event type
              // Token chunks come without an event: line, so we need to check data.token first
              if (data.token) {
                accumulatedContent += data.token;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === streamingMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
                // Clear currentEvent after handling token to prevent it from being reused
                currentEvent = '';
                continue;
              }

              const eventType = currentEvent || data.event || '';

              switch (eventType) {
                case 'thinking': {
                  setThinkingStatus(data.message || data.status || 'Processing document...');
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'token': {
                  const chunk = data.token || '';
                  if (chunk) {
                    accumulatedContent += chunk;
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === streamingMessageId
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      )
                    );
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'message': {
                  const chunk = data.content ?? data.token ?? '';
                  if (chunk) {
                    accumulatedContent += chunk;
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === streamingMessageId
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      )
                    );
                  }
                  if (data.disclaimer) {
                    messageDisclaimer = data.disclaimer;
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'citations': {
                  if (Array.isArray(data.citations)) {
                    messageCitations = data.citations;
                    // Debug: Log citations to see structure
                    console.log('Citations received:', data.citations);
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === streamingMessageId
                          ? { ...msg, citations: messageCitations }
                          : msg
                      )
                    );
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'disclaimer': {
                  if (data.text) {
                    messageDisclaimer = data.text;
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === streamingMessageId
                          ? { ...msg, disclaimer: messageDisclaimer }
                          : msg
                      )
                    );
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'end': {
                  // Handle end event - stream is complete
                  setIsTyping(false);
                  setThinkingStatus('');
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === streamingMessageId
                        ? {
                            ...msg,
                            isStreaming: false,
                            disclaimer: messageDisclaimer || undefined,
                            citations: messageCitations.length > 0 ? messageCitations : undefined
                          }
                        : msg
                    )
                  );
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'done': {
                  messageDisclaimer = data.disclaimer || messageDisclaimer;
                  if (Array.isArray(data.citations)) {
                    messageCitations = data.citations;
                  }
                  setIsTyping(false);
                  setThinkingStatus('');
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === streamingMessageId
                        ? {
                            ...msg,
                            isStreaming: false,
                            disclaimer: messageDisclaimer || undefined,
                            citations: messageCitations.length > 0 ? messageCitations : undefined
                          }
                        : msg
                    )
                  );
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'error': {
                  streamingErrored = true;
                  setIsTyping(false);
                  setThinkingStatus('');
                  const errorMessage = data.error || 'An error occurred while processing the document.';
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === streamingMessageId
                        ? { ...msg, isStreaming: false, content: errorMessage }
                        : msg
                    )
                  );
                  toast({
                    variant: 'destructive',
                    title: 'Document Review Error',
                    description: errorMessage
                  });
                  currentEvent = ''; // Clear after processing
                  break;
                }
                case 'history': {
                  if (data.history) {
                    console.debug('Conversation history update:', data.history);
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
                default: {
                  if (data.status) {
                    setThinkingStatus(data.message || data.status);
                  }
                  // Handle content in default case (tokens are already handled above)
                  if (data.content && !data.token) {
                    accumulatedContent += data.content;
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === streamingMessageId
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      )
                    );
                  }
                  currentEvent = ''; // Clear after processing
                  break;
                }
              }

              if (!eventType && data.citations && Array.isArray(data.citations)) {
                messageCitations = data.citations;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === streamingMessageId 
                      ? { ...msg, citations: messageCitations }
                      : msg
                  )
                );
              }

            } catch (e) {
              console.warn('Failed to parse SSE data:', dataStr);
            }
          }
        }
      }

      if (!streamingErrored) {
        setIsTyping(false);
        setThinkingStatus('');
        setMessages(prev =>
          prev.map(msg =>
            msg.id === streamingMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  disclaimer: messageDisclaimer || undefined,
                  citations: messageCitations.length > 0 ? messageCitations : undefined
                }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error('Error streaming chat:', error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Request Cancelled",
          description: "The chat request was cancelled.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to NADO AI. Using fallback response.",
          variant: "destructive"
        });

        // Fallback to mock response
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: generateAIResponse(content),
          timestamp: new Date(),
          category: 'response'
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
      
      setIsTyping(false);
      setThinkingStatus('');
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('incident') || input.includes('report')) {
      return "To create a new incident report, navigate to the Incidents section in the sidebar and click 'New Incident'. You'll need to provide details about the incident, including date, time, location, involved parties, and a description of what occurred. The system will automatically generate a unique incident number and track the status through resolution.";
    }
    
    if (input.includes('ndis') || input.includes('compliance')) {
      return "NDIS compliance requirements include maintaining participant safety, proper documentation, staff qualifications, and regular reporting. Key areas to focus on are incident management, complaint handling, staff training records, and participant plan adherence. I can help you with specific compliance questions or guide you to the relevant sections in the portal.";
    }
    
    if (input.includes('staff') || input.includes('onboarding')) {
      return "Staff onboarding in CareConnect includes digital checklists, document collection, training assignments, and compliance verification. You can access the Staff Management section to set up new employees, assign training modules, and track their progress through the onboarding process.";
    }
    
    if (input.includes('training') || input.includes('course')) {
      return "The Training & Courses section contains interactive modules covering compliance, safety, and professional development. You can track staff progress, generate certificates upon completion, and assign specific training based on roles and requirements.";
    }
    
    if (input.includes('form') || input.includes('create') || input.includes('e-signature') || input.includes('signature') || input.includes('document')) {
      return "The E-Signature Documents module allows you to upload PDF documents, configure fields using drag-and-drop, and assign them to internal staff or external users for digital signing. You can create reusable templates, track signing progress, and manage completed documents. Internal staff must be authenticated, while external users can sign via unique links without login.";
    }
    
    return "I understand you're asking about: " + userInput + ". Let me help you with that. Could you provide more specific details about what you'd like to know? I can assist with compliance guidance, training support, form creation, staff management, and general portal navigation.";
  };

  // Quick links removed

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question, null);
  };

  const handleViewCitation = async (citation: Citation) => {
    try {
      // Use viewUrl if available (provided by backend)
      if (citation.viewUrl) {
        const token = authService.getToken();
        
        // Backend sends relative path, so combine with base URL
        let url = citation.viewUrl.startsWith('http') 
          ? citation.viewUrl 
          : `${import.meta.env.VITE_BASE_URL}${citation.viewUrl}`;
        
        // Add authentication token as query parameter since window.open doesn't send headers
        if (token) {
          const separator = url.includes('?') ? '&' : '?';
          url = `${url}${separator}token=${encodeURIComponent(token)}`;
        }
        
        // Direct window.open - browser will handle CORS and PDF viewing
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please allow popups to view the file"
          });
        }
        return;
      }

      // Fallback: construct URL manually if viewUrl not provided
      const token = authService.getToken();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Authentication required. Please login again."
        });
        return;
      }

      const identifier = citation.documentId || citation.filePath;
      
      if (!identifier) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File identifier is not available"
        });
        return;
      }

      const url = `${import.meta.env.VITE_BASE_URL}/bot/references/view?filePath=${encodeURIComponent(identifier)}`;
      
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please allow popups to view the file"
        });
      }
    } catch (error: any) {
      console.error('Error viewing citation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to open file"
      });
    }
  };

  const handleDownloadCitation = async (filePath: string, fileName: string) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/bot/references/download?filePath=${encodeURIComponent(filePath)}`;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Downloading ${fileName}...`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to download file"
      });
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, thinkingStatus]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NADO AI Assistant
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your 24/7 AI-powered assistant for compliance guidance, staff training, form creation, and portal navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[70vh] lg:h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat with NADO
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] space-y-2`}
                        >
                          {/* Message bubble */}
                          <div
                            className={`p-3 rounded-lg break-words ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              {message.type === 'user' ? (
                                <p className="text-primary-foreground">{message.content}</p>
                              ) : (
                                <>
                                  <MarkdownRenderer content={message.content} />
                                  {message.isStreaming && (
                                    <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
                                  )}
                                </>
                              )}
                            </div>
                            {message.fileName && (
                              <div
                                className={`mt-2 text-xs flex items-center gap-1 ${
                                  message.type === 'user'
                                    ? 'text-primary-foreground/80'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span className="truncate">{message.fileName}</span>
                              </div>
                            )}
                          </div>

                          {/* Per-message disclaimer */}
                          {/* {message.disclaimer && !message.isStreaming && (
                            <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                              ⚠️ {message.disclaimer}
                            </div>
                          )} */}

                          {/* Citations section */}
                          {message.citations && message.citations.length > 0 && !message.isStreaming && (
                            <div className="mt-3 space-y-2">
                              <div className="text-xs font-medium text-muted-foreground mb-2">References:</div>
                              <div className="space-y-2">
                                {message.citations.map((citation, index) => (
                                  <div
                                    key={citation.documentId || index}
                                    className="flex items-center justify-between p-2 bg-background border rounded-md hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{citation.displayName}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {citation.fileType.toUpperCase()}
                                          </Badge>
                                          <span className="truncate">
                                            {citation.source === 'global' 
                                              ? 'Global Documents' 
                                              : citation.source === 'client'
                                              ? 'Client Documents'
                                              : citation.category || 'Documents'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                      {(citation.fileType?.toLowerCase() === 'pdf' || 
                                        citation.displayName?.toLowerCase().endsWith('.pdf')) && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2"
                                          onClick={() => handleViewCitation(citation)}
                                          title="View PDF file"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Thinking Status */}
                    {thinkingStatus && (
                      <div className="flex justify-start">
                        <Badge variant="secondary" className="gap-2 animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {thinkingStatus}
                        </Badge>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                  </ScrollArea>
                </div>
                
                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t sticky bottom-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-3 w-full">
                      {selectedFile && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 rounded-md px-2 py-1.5">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium truncate">📄 {selectedFile.name}</span>
                            <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={handleRemoveFile}
                            disabled={isTyping}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          className="justify-center sm:w-auto"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isTyping}
                        >
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach Document
                        </Button>
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask NADO anything..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(inputValue);
                            }
                          }}
                          className="flex-1"
                          disabled={isTyping}
                        />
                        <Button
                          onClick={() => handleSendMessage(inputValue)}
                          disabled={!inputValue.trim() || isTyping}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-2 text-sm"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Status */}
          </div>
        </div>
      </div>
    </div>
  );
}
