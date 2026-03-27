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

    const { userId } = await req.json()
    const targetUserId = userId || user.id

    // Fetch profile to get cargo_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('cargo_id')
      .eq('id', targetUserId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    const cargoId = profile?.cargo_id

    // Fetch menus with hierarchy columns
    const { data: menus, error: menusError } = await supabaseAdmin
      .from('menus_sistema')
      .select('id, nome, rota, menu_pai, menu_filho')

    if (menusError) throw menusError

    // Fetch cargo permissions
    let cargoPerms: any[] = []
    if (cargoId) {
      const { data, error } = await supabaseAdmin
        .from('permissoes_cargo')
        .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
        .eq('cargo_id', cargoId)
      if (error) throw error
      cargoPerms = data || []
    }

    // Fetch user permissions overrides
    const { data: userPerms, error: userPermsError } = await supabaseAdmin
      .from('permissoes_usuario')
      .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
      .eq('user_id', targetUserId)

    if (userPermsError) throw userPermsError

    // Combine them (user permissions override cargo permissions)
    const permissions = (menus || []).map((menu: any) => {
      const cargoP = (cargoPerms || []).find((p: any) => p.menu_id === menu.id)
      const userP = (userPerms || []).find((p: any) => p.menu_id === menu.id)

      return {
        menu_id: menu.id,
        nome: menu.nome,
        rota: menu.rota,
        menu_pai: menu.menu_pai,
        menu_filho: menu.menu_filho,
        pode_ver: userP ? userP.pode_ver : cargoP ? cargoP.pode_ver : false,
        pode_criar: userP ? userP.pode_criar : cargoP ? cargoP.pode_criar : false,
        pode_editar: userP ? userP.pode_editar : cargoP ? cargoP.pode_editar : false,
        pode_deletar: userP ? userP.pode_deletar : cargoP ? cargoP.pode_deletar : false,
      }
    })

    return new Response(JSON.stringify({ permissions }), {
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
