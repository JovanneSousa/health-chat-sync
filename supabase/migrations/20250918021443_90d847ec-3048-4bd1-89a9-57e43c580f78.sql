-- Fix the status check constraint to include 'resolved'
ALTER TABLE public.conversations DROP CONSTRAINT conversations_status_check;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'resolved'::text, 'pending'::text, 'closed'::text, 'waiting'::text]));

-- Ensure tables have realtime enabled
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;