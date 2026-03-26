import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
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

    // Verify if user is Master or Admin
    const { data: isMaster } = await supabaseAdmin.rpc('is_master_user', { user_uuid: user.id })
    const { data: isAdmin } = await supabaseAdmin.rpc('is_admin_user', { user_uuid: user.id })

    if (!isMaster && !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, message: 'User is not admin or master' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const { data: employee } = await supabaseAdmin
      .from('employees')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const modules = [
      'DASHBOARD',
      'AGENDA',
      'MENSAGENS',
      'RH',
      'ESCALA DE TRABALHO',
      'ESTOQUE',
      'PRECIFICAÇÃO',
      'ACESSOS',
      'LOGS',
      'CONFIGURAÇÕES',
      'SAC',
      'ROTINA DIÁRIA',
      'PERFORMANCE',
      'COMUNICADOS',
      'NEGOCIAÇÃO',
      'GESTÃO FISCAL',
      'KPIS',
      'SEGMENTAÇÃO',
      'dashboards',
      'agenda',
      'mensagens',
      'usuarios-rh',
      'escala-trabalho',
      'estoque',
      'precificacao',
      'central-acessos',
      'logs',
      'configuracoes',
      'sac',
      'rotina-diaria',
      'performance',
      'comunicados',
      'negociacao',
      'gestao-fiscal',
      'kpis',
      'segmentacao-agenda',
    ]

    // Grant user_permissions
    for (const mod of modules) {
      await supabaseAdmin.from('user_permissions').upsert(
        {
          user_id: user.id,
          module: mod,
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, module' },
      )
    }

    // Grant role_permissions
    if (employee && employee.role) {
      for (const mod of modules) {
        await supabaseAdmin.from('role_permissions').upsert(
          {
            role: employee.role,
            module: mod,
            can_view: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'role, module' },
        )
      }
    }

    return new Response(JSON.stringify({ success: true, restored: true }), {
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
