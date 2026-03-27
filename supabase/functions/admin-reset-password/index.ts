import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { email } = await req.json()
    if (!email) {
      throw new Error('Missing required field (email)')
    }

    if (resendApiKey) {
      // Use Resend to send the reset link
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      })

      if (linkError) throw linkError

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Nuvia Odontologia <no-reply@clinicanuvia.com.br>',
          to: email,
          subject: 'Redefinição de Senha',
          html: `<p>Olá,</p><p>Clique no link abaixo para redefinir sua senha:</p><p><a href="${linkData.properties.action_link}">Redefinir Senha</a></p>`,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Resend error:', errText)
        throw new Error('Erro ao enviar email via Resend')
      }
    } else {
      // Fallback to Supabase built-in email
      const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email)
      if (resetError) throw resetError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
