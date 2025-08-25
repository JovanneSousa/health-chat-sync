import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export interface Conversation {
  id: string;
  patientName: string;
  channel: "whatsapp" | "email" | "phone" | "instagram" | "facebook";
  lastMessage: string;
  timestamp: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  attendant?: string;
  unreadCount: number;
}

const channelIcons = {
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
};

const channelColors = {
  whatsapp: "text-green-600",
  email: "text-blue-600", 
  phone: "text-gray-600",
  instagram: "text-pink-600",
  facebook: "text-blue-700",
};

const statusIcons = {
  pending: AlertCircle,
  "in-progress": Clock,
  resolved: CheckCircle2,
};

const statusColors = {
  pending: "text-warning",
  "in-progress": "text-primary",
  resolved: "text-success",
};

const priorityColors = {
  low: "border-l-green-500",
  medium: "border-l-yellow-500", 
  high: "border-l-red-500",
};

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  filter?: string;
}

export function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect,
  filter = "all"
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv => {
    if (filter === "all") return true;
    if (filter === "pending") return conv.status === "pending";
    if (filter === "in-progress") return conv.status === "in-progress";
    if (filter === "resolved") return conv.status === "resolved";
    return conv.channel === filter;
  });

  return (
    <div className="space-y-2 p-4">
      {filteredConversations.map((conversation) => {
        const ChannelIcon = channelIcons[conversation.channel];
        const StatusIcon = statusIcons[conversation.status];
        
        return (
          <Card
            key={conversation.id}
            className={cn(
              "p-4 cursor-pointer transition-all hover:shadow-card border-l-4",
              priorityColors[conversation.priority],
              selectedId === conversation.id && "bg-accent shadow-elevated"
            )}
            onClick={() => onSelect(conversation)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`/placeholder-patient-${conversation.id}.jpg`} />
                <AvatarFallback className="bg-muted">
                  {conversation.patientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {conversation.patientName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <ChannelIcon className={cn("w-4 h-4", channelColors[conversation.channel])} />
                    <StatusIcon className={cn("w-4 h-4", statusColors[conversation.status])} />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground truncate mb-2">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {conversation.attendant && (
                      <span className="text-xs text-muted-foreground">
                        {conversation.attendant}
                      </span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="w-5 h-5 text-xs p-0 flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}