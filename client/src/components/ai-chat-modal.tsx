import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Mic, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'How can I help you secure your device today? You can say things like "Lock social media for Emma" or "Set bedtime restrictions".',
      timestamp: new Date()
    }
  ]);

  const { toast } = useToast();
  const { 
    isListening, 
    result, 
    error, 
    startListening, 
    stopListening, 
    resetResult,
    isSupported 
  } = useSpeechRecognition();

  const voiceCommandMutation = useMutation({
    mutationFn: (text: string) => apiRequest('POST', '/api/ai/voice-command', { text }),
    onSuccess: (response) => {
      const data = response.json();
      toast({
        title: "Voice Command Processed",
        description: data.explanation,
      });
    },
    onError: () => {
      toast({
        title: "Voice Command Failed",
        description: "Failed to process voice command. Please try again.",
        variant: "destructive",
      });
    }
  });

  const chatMutation = useMutation({
    mutationFn: (message: string) => apiRequest('POST', '/api/ai/chat', { message }),
    onSuccess: async (response) => {
      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm sorry, I'm experiencing technical difficulties. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      resetResult();
      startListening();
    }
  };

  // Process speech result when it's final
  useEffect(() => {
    if (result?.isFinal && result.transcript.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: result.transcript,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      voiceCommandMutation.mutate(result.transcript);
      chatMutation.mutate(result.transcript);
      resetResult();
    }
  }, [result]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-96 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 bg-ai-purple">
                <AvatarFallback>
                  <Brain className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base">AI Assistant</DialogTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isListening ? 'Listening...' : 'Ready to help'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'space-x-2'}`}>
              {message.type === 'ai' && (
                <Avatar className="w-8 h-8 bg-ai-purple flex-shrink-0">
                  <AvatarFallback>
                    <Brain className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`rounded-lg p-3 max-w-xs ${
                message.type === 'user' 
                  ? 'bg-trust-blue text-white ml-auto' 
                  : 'bg-purple-100 dark:bg-purple-900/30 flex-1'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {(voiceCommandMutation.isPending || chatMutation.isPending) && (
            <div className="flex space-x-2">
              <Avatar className="w-8 h-8 bg-ai-purple flex-shrink-0">
                <AvatarFallback>
                  <Brain className="h-4 w-4 text-white animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 flex-1">
                <p className="text-sm text-gray-500">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isSupported ? (
            <p className="text-sm text-gray-500 text-center">
              Speech recognition not supported in this browser
            </p>
          ) : error ? (
            <p className="text-sm text-red-500 text-center">{error}</p>
          ) : (
            <Button 
              className="w-full bg-ai-purple hover:bg-purple-700 text-white"
              onClick={handleVoiceCommand}
              disabled={voiceCommandMutation.isPending}
            >
              <Mic className={`mr-2 h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Tap to Stop' : 'Tap to Speak'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
