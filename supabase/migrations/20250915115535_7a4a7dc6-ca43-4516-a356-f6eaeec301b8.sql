-- Create test users in auth.users and corresponding profiles
-- Note: In production, users should be created through the signup flow
-- This is only for demo purposes

-- Insert demo users into auth.users (this requires service role permissions)
-- We'll create a function to handle this properly

-- First, let's create demo profiles that will be linked when users sign up
INSERT INTO public.profiles (id, email, name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'paciente@exemplo.com', 'João Silva', 'patient'),
  ('00000000-0000-0000-0000-000000000002', 'atendente@clinica.com', 'Maria Santos', 'attendant'),
  ('00000000-0000-0000-0000-000000000003', 'gerente@clinica.com', 'Dr. Carlos Lima', 'manager')
ON CONFLICT (id) DO NOTHING;

-- Create a function to initialize demo users (to be called manually via SQL editor)
CREATE OR REPLACE FUNCTION public.create_demo_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function should be executed manually in Supabase SQL editor
  -- as it requires service role permissions to insert into auth.users
  RAISE NOTICE 'Demo users function created. Execute manually in Supabase SQL editor with service role.';
END;
$$;