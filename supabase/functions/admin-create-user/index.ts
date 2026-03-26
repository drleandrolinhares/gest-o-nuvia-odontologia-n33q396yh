import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Create an admin client using the service role key to bypass RLS and use Admin API
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Verify the user making the request is authenticated
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { email, password, name } = await req.json()
    if (!email || !password || !name) {
      throw new Error('Missing required fields (email, password, name)')
    }

    // Attempt to create the user
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (createError) {
      const isAlreadyRegistered =
        createError.message.includes('already been registered') ||
        createError.message.includes('already exists')

      if (isAlreadyRegistered) {
        // Since the profiles table has been deleted, we cannot check for orphaned accounts easily.
        // If an email exists, we just return the error.
        return new Response(JSON.stringify({ error: 'E-mail já está em uso por outro usuário.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } else {
        // Map other errors to human readable strings
        let msg = createError.message
        if (msg.includes('Password should be at least')) {
          msg = 'A senha deve ter pelo menos 6 caracteres.'
        }
        return new Response(JSON.stringify({ error: msg }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }

    if (data && data.user) {
      // Call RPC to enforce auth.users strict requirements (empty string instead of NULL)
      await supabaseAdmin.rpc('fix_auth_user_tokens', { user_id: data.user.id })

      return new Response(JSON.stringify({ id: data.user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    throw new Error('Failed to determine user ID')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
