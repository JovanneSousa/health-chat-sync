-- Allow attendants to view unassigned conversations
DO $$ BEGIN
  -- Create policy to allow attendants to view unassigned conversations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations' AND policyname = 'Attendants can view unassigned conversations'
  ) THEN
    CREATE POLICY "Attendants can view unassigned conversations"
    ON public.conversations
    FOR SELECT
    USING (
      public.get_current_user_role() = 'attendant'::user_role
      AND attendant_id IS NULL
    );
  END IF;
END $$;

-- Allow attendants to view messages in unassigned conversations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Attendants can view messages in unassigned conversations'
  ) THEN
    CREATE POLICY "Attendants can view messages in unassigned conversations"
    ON public.messages
    FOR SELECT
    USING (
      public.get_current_user_role() = 'attendant'::user_role
      AND EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.id = messages.conversation_id
          AND c.attendant_id IS NULL
      )
    );
  END IF;
END $$;