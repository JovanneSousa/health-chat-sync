-- Fix RLS policies to ensure proper access for attendants and managers

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Attendants can view assigned conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.messages;

-- Create better RLS policies for conversations
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (
  patient_id = auth.uid() OR 
  attendant_id = auth.uid() OR 
  get_current_user_role() = 'manager'
);

-- Create better RLS policies for messages
CREATE POLICY "Users can view messages in accessible conversations" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.patient_id = auth.uid() OR 
      conversations.attendant_id = auth.uid() OR 
      get_current_user_role() = 'manager'
    )
  )
);

CREATE POLICY "Users can send messages in accessible conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.patient_id = auth.uid() OR 
      conversations.attendant_id = auth.uid() OR 
      get_current_user_role() = 'manager'
    )
  )
);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;