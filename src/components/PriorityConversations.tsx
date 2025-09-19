import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useConversationsList } from '@/hooks/useConversationsList';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, MessageCircle } from 'lucide-react';

export function PriorityConversations() {
  const { conversations, isLoading } = useConversationsList();
  const navigate = useNavigate();

  const priorityConversations = conversations
    .filter(conv => conv.priority === 'high' || conv.priority === 'urgent' || conv.status === 'pending')
    .slice(0, 3)
    .map(conv => ({
      id: conv.id,
      patientName: conv.patient_name,
      title: conv.title,
      priority: conv.priority,
      status: conv.status,
    }));

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <MessageCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string, status: string) => {
    if (status === 'pending') {
      return <Badge variant="outline">Pendente</Badge>;
    }
    
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary">Média</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getBorderColor = (priority: string, status: string) => {
    if (status === 'pending') {
      return 'border-warning/20 bg-warning/5';
    }
    
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'border-destructive/20 bg-destructive/5';
      case 'medium':
        return 'border-warning/20 bg-warning/5';
      default:
        return 'bg-muted/50';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Carregando conversas prioritárias...
      </div>
    );
  }

  if (priorityConversations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Nenhuma conversa prioritária no momento
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {priorityConversations.map((conv) => (
        <div
          key={conv.id}
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getBorderColor(conv.priority, conv.status)}`}
          onClick={() => navigate(`/chat/${conv.id}`)}
        >
          <div className="flex items-center space-x-3">
            {getPriorityIcon(conv.priority)}
            <div>
              <p className="font-medium">{conv.patientName}</p>
              <p className="text-sm text-muted-foreground">{conv.title}</p>
            </div>
          </div>
          {getPriorityBadge(conv.priority, conv.status)}
        </div>
      ))}
    </div>
  );
}