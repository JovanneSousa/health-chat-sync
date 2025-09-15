import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'attendant' | 'manager';
}

const demoUsers: DemoUser[] = [
  {
    email: 'paciente@exemplo.com',
    password: '123456',
    name: 'João Silva',
    role: 'patient'
  },
  {
    email: 'atendente@clinica.com',
    password: '123456',
    name: 'Maria Santos',
    role: 'attendant'
  },
  {
    email: 'gerente@clinica.com',
    password: '123456',
    name: 'Dr. Carlos Lima',
    role: 'manager'
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const results = [];

    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabaseClient.auth.admin.getUserByEmail(user.email);
      
      if (existingUser.user) {
        console.log(`User ${user.email} already exists, skipping...`);
        results.push({ email: user.email, status: 'already_exists' });
        continue;
      }

      // Create user with admin API
      const { data, error } = await supabaseClient.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        }
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error);
        results.push({ email: user.email, status: 'error', error: error.message });
      } else {
        console.log(`Successfully created user ${user.email}`);
        results.push({ email: user.email, status: 'created', id: data.user?.id });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      results,
      message: 'Demo users creation completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-demo-users function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});