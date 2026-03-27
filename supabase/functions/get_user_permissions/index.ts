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

    let targetUserId = user.id
    try {
      const body = await req.json()
      if (body && body.userId) {
        targetUserId = body.userId
      }
    } catch (e) {
      // Ignorar caso o body esteja vazio
    }

    // Buscar perfil para obter cargo_id garantindo que consultamos a tabela vinculada ao auth.users
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('cargo_id')
      .eq('id', targetUserId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    const cargoId = profile?.cargo_id

    // Buscar menus do sistema com suporte a hierarquia
    const { data: menus, error: menusError } = await supabaseAdmin
      .from('menus_sistema')
      .select('id, nome, rota, menu_pai, menu_filho')

    if (menusError) throw menusError

    // Buscar permissões atreladas ao cargo do usuário
    let cargoPerms: any[] = []
    if (cargoId) {
      const { data, error } = await supabaseAdmin
        .from('permissoes_cargo')
        .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
        .eq('cargo_id', cargoId)
      if (error) throw error
      cargoPerms = data || []
    }

    // Buscar permissões específicas sobrescritas para o usuário
    const { data: userPerms, error: userPermsError } = await supabaseAdmin
      .from('permissoes_usuario')
      .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
      .eq('user_id', targetUserId)

    if (userPermsError) throw userPermsError

    // Combinar regras de permissão garantindo o formato correto de visualização
    const permissions = (menus || []).map((menu: any) => {
      const parentMenu = menu.menu_filho
        ? (menus || []).find((m: any) => m.nome === menu.menu_pai && !m.menu_filho)
        : null

      const cargoP = (cargoPerms || []).find((p: any) => p.menu_id === menu.id)
      const userP = (userPerms || []).find((p: any) => p.menu_id === menu.id)

      const parentCargoP = parentMenu
        ? (cargoPerms || []).find((p: any) => p.menu_id === parentMenu.id)
        : null
      const parentUserP = parentMenu
        ? (userPerms || []).find((p: any) => p.menu_id === parentMenu.id)
        : null

      const resolvePerm = (field: string) => {
        // 1. Prioridade: Sobrescrita de usuário (Filho)
        if (userP && userP[field] !== undefined) return userP[field]
        // 2. Prioridade: Sobrescrita de usuário (Pai) - herda true
        if (parentUserP && parentUserP[field] === true) return true
        // 3. Prioridade: Permissão do Cargo (Filho)
        if (cargoP && cargoP[field] !== undefined) return cargoP[field]
        // 4. Prioridade: Permissão do Cargo (Pai) - herda true
        if (parentCargoP && parentCargoP[field] === true) return true

        return false
      }

      const podeVer = resolvePerm('pode_ver')

      return {
        menu_id: menu.id,
        nome: menu.nome,
        rota: menu.rota,
        menu_pai: menu.menu_pai,
        menu_filho: menu.menu_filho,
        pode_ver: podeVer, // Retrocompatibilidade
        pode_visualizar: podeVer, // Novo formato de resposta explícito
        pode_criar: resolvePerm('pode_criar'),
        pode_editar: resolvePerm('pode_editar'),
        pode_deletar: resolvePerm('pode_deletar'),
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
