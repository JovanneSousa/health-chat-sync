-- Fix the status check constraint to include 'resolved'
ALTER TABLE public.conversations DROP CONSTRAINT conversations_status_check;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'resolved'::text, 'pending'::text, 'closed'::text, 'waiting'::text]));

-- Ensure conversations table has realtime enabled
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add conversations to realtime publication if not already added
INSERT INTO supabase_realtime.subscription (entity, filters, claims) 
VALUES ('public.conversations', '[]', '{}')
ON CONFLICT DO NOTHING;

INSERT INTO supabase_realtime.subscription (entity, filters, claims) 
VALUES ('public.messages', '[]', '{}') 
ON CONFLICT DO NOTHING;