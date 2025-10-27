import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Lightbulb, 
  Shield, 
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

const quickActions = [
  {
    id: 'compliance-help',
    title: 'Compliance Help',
    description: 'Get guidance on regulatory requirements',
    icon: Shield,
    color: 'bg-blue-500'
  },
  {
    id: 'training-support',
    title: 'Training Support',
    description: 'Assistance with staff training modules',
    icon: BookOpen,
    color: 'bg-green-500'
  },
  {
    id: 'form-creation',
    title: 'Form Creation',
    description: 'Help creating custom forms and workflows',
    icon: FileText,
    color: 'bg-purple-500'
  },
  {
    id: 'staff-management',
    title: 'Staff Management',
    description: 'Guidance on HR and staff processes',
    icon: Users,
    color: 'bg-orange-500'
  }
];

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
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        category: 'response'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      handleSendMessage(`I need help with ${action.title.toLowerCase()}`);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
                          className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg max-h-48 sm:max-h-60 overflow-y-auto break-words whitespace-pre-wrap ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
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
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleQuickAction(action.id)}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

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
