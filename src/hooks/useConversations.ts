import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useConversations() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createConversation = async (title: string = 'Nova Conversa') => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para iniciar uma conversa",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating conversation for user:', user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          title,
          patient_id: user.id,
          status: 'active',
          priority: 'normal'
        })
        .select()
        .single();

      console.log('Conversation creation result:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      // Create initial message
      if (data) {
        const messageResult = await supabase
          .from('messages')
          .insert({
            conversation_id: data.id,
            sender_id: user.id,
            content: 'Olá! Preciso de ajuda.',
            message_type: 'text'
          });
          
        console.log('Message creation result:', messageResult);
      }

      toast({
        title: "Conversa iniciada",
        description: "Sua conversa foi criada com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientConversations = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            content,
            created_at,
            sender_id
          )
        `)
        .eq('patient_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  };

  return {
    createConversation,
    getPatientConversations,
    isLoading
  };
}