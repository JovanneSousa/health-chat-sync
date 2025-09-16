-- Fix conversations table to ensure patient_id is not null for proper RLS
ALTER TABLE public.conversations 
ALTER COLUMN patient_id SET NOT NULL;

-- Recreate the insert policy to be more explicit
DROP POLICY IF EXISTS "Patients can create conversations" ON public.conversations;

CREATE POLICY "Patients can create conversations" 
ON public.conversations 
FOR INSERT 
TO authenticated
WITH CHECK (
  patient_id = auth.uid() 
  AND patient_id IS NOT NULL
);

-- Also ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_patient_id ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_attendant_id ON public.conversations(attendant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);