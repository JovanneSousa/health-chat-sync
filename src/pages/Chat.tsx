import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';
import type { Conversation as UIConversation } from '@/components/ConversationList';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversation, messages, isLoading, sendMessage } = useChat(id);

  useEffect(() => {
    document.title = conversation?.title
      ? `Chat - ${conversation.title}`
      : 'Chat - Conversa';
  }, [conversation?.title]);

  const uiConversation: UIConversation | null = useMemo(() => {
    if (!conversation) return null;

    // Map DB status/priority to UI values
    const statusMap: Record<string, UIConversation['status']> = {
      active: 'in-progress',
      resolved: 'resolved',
      pending: 'pending',
    };
    const priorityMap: Record<string, UIConversation['priority']> = {
      low: 'low',
      normal: 'medium',
      medium: 'medium',
      high: 'high',
      urgent: 'high',
    };

    // Get patient name from the conversation
    let patientName = 'Paciente';
    if (user?.role === 'patient') {
      patientName = user.name || 'Você';
    } else {
      // For attendants/managers, we need to get patient name from DB
      // For now, using a generic name since we don't have patient info loaded
      patientName = 'Paciente';
    }

    return {
      id: conversation.id,
      patientName,
      channel: 'whatsapp',
      lastMessage: '',
      timestamp: new Date(conversation.updated_at || conversation.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: statusMap[conversation.status] || 'in-progress',
      priority: priorityMap[conversation.priority] || 'medium',
      attendant: conversation.attendant_id ? 'Atendente' : undefined,
      unreadCount: 0,
    };
  }, [conversation, user]);

  const uiMessages = useMemo(() => {
    if (!conversation || !user) return [];
    return messages.map((m) => ({
      id: m.id,
      text: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sender: (m.sender_id === user.id ? 
        (user.role === 'patient' ? 'patient' : 'attendant') : 
        (user.role === 'patient' ? 'attendant' : 'patient')
      ) as 'patient' | 'attendant',
      type: 'text' as const,
    }));
  }, [messages, conversation, user]);

  if (isLoading || !uiConversation) {
    return (
      <div className="min-h-screen bg-gradient-health flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const handleSend = (text: string) => sendMessage(text);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white shadow-card border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-base font-semibold">{conversation?.title || 'Conversa'}</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-[calc(100vh-4rem)]">
        <div className="h-full bg-card rounded-lg border shadow-card overflow-hidden">
          <ChatInterface
            conversation={uiConversation}
            messages={uiMessages}
            onSendMessage={handleSend}
          />
        </div>
      </main>
    </div>
  );
};

export default Chat;
