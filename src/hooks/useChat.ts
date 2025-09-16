import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface DbConversation {
  id: string;
  title: string;
  patient_id: string;
  attendant_id: string | null;
  status: string; // 'active' | 'resolved' | etc
  priority: string; // 'normal' | 'high' | etc
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

export function useChat(conversationId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [conversation, setConversation] = useState<DbConversation | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      try {
        setIsLoading(true);
        const { data: conv, error: convErr } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .maybeSingle();
        if (convErr) throw convErr;
        if (!conv) {
          toast({
            title: 'Conversa não encontrada',
            description: 'Verifique o link e tente novamente.',
            variant: 'destructive',
          });
          return;
        }
        setConversation(conv as DbConversation);

        const { data: msgs, error: msgErr } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        if (msgErr) throw msgErr;
        setMessages((msgs || []) as DbMessage[]);

        // Realtime updates for new messages
        channel = supabase
          .channel(`messages_conversation_${conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
              setMessages((prev) => [...prev, payload.new as DbMessage]);
            }
          )
          .subscribe();
      } catch (e) {
        console.error('Erro ao carregar chat:', e);
        toast({
          title: 'Erro ao carregar chat',
          description: 'Tente novamente em instantes.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, toast]);

  const sendMessage = async (text: string) => {
    if (!user || !conversationId) return;
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: text,
        message_type: 'text',
      });
      if (error) throw error;
    } catch (e) {
      console.error('Erro ao enviar mensagem:', e);
      toast({
        title: 'Não foi possível enviar',
        description: 'Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return { conversation, messages, isLoading, sendMessage };
}
