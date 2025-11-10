import { useEffect, useState, useCallback } from 'react';
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

  const loadData = useCallback(async () => {
    if (!conversationId) return;
    
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
  }, [conversationId, toast]);

  // Load data on mount and when conversationId changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Setup realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    console.log(`Setting up realtime for conversation ${conversationId}`);
    
    const channel = supabase
      .channel(`chat_conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received via realtime:', payload);
          const newMessage = payload.new as DbMessage;
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            if (prev.some(msg => msg.id === newMessage.id)) {
              console.log('Message already exists, skipping duplicate');
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Conversation updated via realtime:', payload);
          setConversation(payload.new as DbConversation);
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for conversation ${conversationId}:`, status);
      });

    return () => {
      console.log(`Cleaning up realtime for conversation ${conversationId}`);
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async (text: string) => {
    if (!user || !conversationId) {
      console.error('Missing user or conversationId:', { user: !!user, conversationId });
      return;
    }
    
    try {
      console.log('Sending message:', { conversationId, userId: user.id, content: text, userRole: user.role });
      
      // If user is attendant and conversation is not assigned, assign it to them
      if (user.role === 'attendant' && conversation && !conversation.attendant_id) {
        console.log('Assigning conversation to attendant:', user.id);
        await supabase
          .from('conversations')
          .update({ attendant_id: user.id })
          .eq('id', conversationId);
      }
      
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: text,
        message_type: 'text',
      }).select();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Message sent successfully:', data);
      
      // Add message immediately to state for instant feedback
      if (data && data[0]) {
        setMessages((prev) => {
          if (prev.some(msg => msg.id === data[0].id)) {
            return prev;
          }
          return [...prev, data[0] as DbMessage];
        });
      }
      
      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
        
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
