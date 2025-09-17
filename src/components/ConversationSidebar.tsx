import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useConversationsList } from '@/hooks/useConversationsList';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Users
} from 'lucide-react';

export function ConversationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { conversations, isLoading, assignConversation, updateStatus } = useConversationsList();

  const currentChatId = location.pathname.match(/\/chat\/([^/]+)/)?.[1];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/30';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-950/30';
      default: return 'border-l-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'active': return <Clock className="w-4 h-4 text-primary" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <MessageCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleAssignToMe = async (conversationId: string) => {
    if (user?.role === 'attendant') {
      await assignConversation(conversationId, user.id);
    }
  };

  const handleMarkResolved = async (conversationId: string) => {
    await updateStatus(conversationId, 'resolved');
  };

  const filteredConversations = conversations.filter(conv => {
    if (user?.role === 'patient') return true;
    if (user?.role === 'attendant') {
      // Show assigned conversations and unassigned pending ones
      return conv.attendant_id === user.id || (conv.attendant_id === null && conv.status !== 'resolved');
    }
    return true; // Managers see all
  });

  return (
    <div className="w-80 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Conversas
          {user?.role === 'manager' && (
            <Badge variant="secondary" className="ml-auto">
              <Users className="w-3 h-3 mr-1" />
              {conversations.length}
            </Badge>
          )}
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Carregando conversas...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma conversa encontrada
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={cn(
                  "p-3 cursor-pointer transition-all hover:shadow-md border-l-4",
                  getPriorityColor(conversation.priority),
                  currentChatId === conversation.id && "ring-2 ring-primary"
                )}
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {conversation.patient_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.patient_name}
                      </h4>
                      {getStatusIcon(conversation.status)}
                    </div>

                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {conversation.last_message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {conversation.last_message_at ? 
                          new Date(conversation.last_message_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 
                          new Date(conversation.updated_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        }
                      </span>

                      {conversation.unread_count && conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>

                    {/* Action buttons for attendants/managers */}
                    {(user?.role === 'attendant' || user?.role === 'manager') && (
                      <div className="flex gap-1 mt-2">
                        {conversation.attendant_id === null && user?.role === 'attendant' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignToMe(conversation.id);
                            }}
                          >
                            <User className="w-3 h-3 mr-1" />
                            Assumir
                          </Button>
                        )}
                        {conversation.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkResolved(conversation.id);
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Resolver
                          </Button>
                        )}
                      </div>
                    )}

                    {conversation.attendant_id && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Atribuída
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator />
      
      <div className="p-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Ativas:</span>
            <span>{filteredConversations.filter(c => c.status === 'active').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Pendentes:</span>
            <span>{filteredConversations.filter(c => c.status === 'pending').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Resolvidas:</span>
            <span>{filteredConversations.filter(c => c.status === 'resolved').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}