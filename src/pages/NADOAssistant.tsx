import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Send, 
  MessageSquare,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Citation {
  documentId: string;
  displayName: string;
  category: string;
  filePath: string;
  fileType: string;
  similarity: number;
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
  const [currentDisclaimer, setCurrentDisclaimer] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setThinkingStatus('Connecting...');
    setCurrentDisclaimer('');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Prepare conversation history for API
      const history = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bot/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          history: history
        }),
        signal: abortControllerRef.current.signal
      });

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

              // Handle citations event
              if (currentEvent === 'citations' && data.citations && Array.isArray(data.citations)) {
                messageCitations = data.citations;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === streamingMessageId 
                      ? { ...msg, citations: messageCitations }
                      : msg
                  )
                );
                continue;
              }

              // Handle thinking status
              if (data.status) {
                setThinkingStatus(data.message || data.status);
              }

              // Handle disclaimer
              if (data.text && !data.token) {
                messageDisclaimer = data.text;
                setCurrentDisclaimer(data.text);
              }

              // Handle token streaming
              if (data.token) {
                accumulatedContent += data.token;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === streamingMessageId 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }

              // Handle history (optional - could be used for debugging)
              if (data.history) {
                console.log('Conversation history:', data.history);
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', dataStr);
            }
          }
        }
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
    
    if (input.includes('form') || input.includes('create')) {
      return "The Form Builder allows you to create custom forms with drag-and-drop functionality. You can add fields like signatures, dates, text inputs, and checkboxes. Forms can be designated for internal or external use and include secure email workflows for distribution and completion.";
    }
    
    return "I understand you're asking about: " + userInput + ". Let me help you with that. Could you provide more specific details about what you'd like to know? I can assist with compliance guidance, training support, form creation, staff management, and general portal navigation.";
  };

  // Quick links removed

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleViewCitation = async (filePath: string, fileName: string) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/bot/references/view?filePath=${encodeURIComponent(filePath)}`;
      window.open(url, '_blank');
    } catch (error: any) {
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
                          </div>

                          {/* Per-message disclaimer */}
                          {message.disclaimer && !message.isStreaming && (
                            <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                              ⚠️ {message.disclaimer}
                            </div>
                          )}

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
                                          {citation.category && (
                                            <span className="truncate">{citation.category}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() => handleViewCitation(citation.filePath, citation.displayName)}
                                        title="View file"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() => handleDownloadCitation(citation.filePath, citation.displayName)}
                                        title="Download file"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
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
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask NADO anything..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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
