import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { DbConversation } from './useChat';

export interface ConversationWithPatient extends DbConversation {
  patient_name: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export function useConversationsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationWithPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Use a basic select and join with profiles manually
      let query = supabase.from('conversations').select('*');

      // Filter based on user role
      if (user.role === 'attendant') {
        // Attendants see their assigned conversations + unassigned ones
        query = query.or(`attendant_id.eq.${user.id},attendant_id.is.null`);
      } else if (user.role === 'patient') {
        // Patients see only their own conversations
        query = query.eq('patient_id', user.id);
      }
      // Managers see all conversations (no filter)

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;

      // Get last message and patient name for each conversation
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          const [lastMessageResult, patientResult] = await Promise.all([
            supabase
              .from('messages')
              .select('content, created_at')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from('profiles')
              .select('name')
              .eq('id', conv.patient_id)
              .single()
          ]);

          return {
            ...conv,
            patient_name: patientResult.data?.name || 'Paciente',
            last_message: lastMessageResult.data?.content || 'Nenhuma mensagem ainda',
            last_message_at: lastMessageResult.data?.created_at,
            unread_count: 0, // Mock for now
          } as ConversationWithPatient;
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Erro ao carregar conversas',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const assignConversation = async (conversationId: string, attendantId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ attendant_id: attendantId })
        .eq('id', conversationId);

      if (error) throw error;

      await fetchConversations();
      
      toast({
        title: 'Conversa atribuída',
        description: 'Conversa atribuída com sucesso.',
      });
    } catch (error) {
      console.error('Error assigning conversation:', error);
      toast({
        title: 'Erro ao atribuir conversa',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const updateStatus = async (conversationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId);

      if (error) throw error;

      await fetchConversations();
      
      toast({
        title: 'Status atualizado',
        description: `Conversa marcada como ${status}.`,
      });
    } catch (error) {
      console.error('Error updating conversation status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();

      // Subscribe to realtime updates
      const channel = supabase
        .channel('conversations_list_updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'conversations',
        }, () => {
          console.log('Conversation changed, updating list...');
          fetchConversations();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
        }, () => {
          console.log('Message changed, updating conversation list...');
          fetchConversations();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    conversations,
    isLoading,
    refetchConversations: fetchConversations,
    assignConversation,
    updateStatus,
  };
}