import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Calendar,
  FileText
} from "lucide-react";
import type { Conversation } from "./ConversationList";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "patient" | "attendant";
  type: "text" | "image" | "file";
}

interface ChatInterfaceProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatInterface({ conversation, messages, onSendMessage }: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickResponses = [
    "Bom dia! Como posso ajudá-lo?",
    "Vou verificar sua agenda",
    "Aguarde um momento, por favor",
    "Obrigado pelo contato!"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/placeholder-patient-${conversation.id}.jpg`} />
              <AvatarFallback className="bg-muted">
                {conversation.patientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-foreground">{conversation.patientName}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={conversation.status === "resolved" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {conversation.status === "pending" && "Aguardando"}
                  {conversation.status === "in-progress" && "Em atendimento"}
                  {conversation.status === "resolved" && "Resolvido"}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">
                  {conversation.channel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "attendant" && "justify-end"
              )}
            >
              {message.sender === "patient" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder-patient-${conversation.id}.jpg`} />
                  <AvatarFallback className="bg-muted text-xs">
                    {conversation.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-[70%] px-4 py-2 rounded-lg",
                  message.sender === "patient" 
                    ? "bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <span className={cn(
                  "text-xs mt-1 block",
                  message.sender === "patient" 
                    ? "text-muted-foreground" 
                    : "text-primary-foreground/70"
                )}>
                  {message.timestamp}
                </span>
              </div>

              {message.sender === "attendant" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    EU
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Responses */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {quickResponses.map((response, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setMessageText(response)}
            >
              {response}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="bg-gradient-medical hover:shadow-medical"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}