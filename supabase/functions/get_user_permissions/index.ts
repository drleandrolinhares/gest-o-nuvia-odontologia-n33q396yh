import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

// In-memory cache for the edge function isolate
const permissionsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
    let bustCache = false

    try {
      const body = await req.json()
      if (body && body.userId) {
        targetUserId = body.userId
      }
      if (body && body.bustCache) {
        bustCache = true
      }
    } catch (e) {
      // Ignore if body is empty
    }

    // 4. Check Cache to prevent slowness
    if (!bustCache) {
      const cached = permissionsCache.get(targetUserId)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return new Response(JSON.stringify({ permissions: cached.data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }

    // Buscar perfil para obter cargo_id garantindo que consultamos a tabela vinculada ao auth.users
    const { data: userCargo, error: cargoError } = await supabaseAdmin
      .from('user_cargos')
      .select('cargo_id')
      .eq('user_id', targetUserId)
      .eq('is_principal', true)
      .maybeSingle()

    if (cargoError && cargoError.code !== 'PGRST116') {
      throw cargoError
    }

    const cargoId = userCargo?.cargo_id

    // 3. Buscar todos os menus/submenus do sistema com suporte a hierarquia
    const { data: menus, error: menusError } = await supabaseAdmin
      .from('menus_sistema')
      .select('id, nome, rota, menu_pai, menu_filho')

    if (menusError) throw menusError

    // 1. Buscar permissões atreladas ao cargo do usuário em permissoes_cargo
    let cargoPerms: any[] = []
    if (cargoId) {
      const { data, error } = await supabaseAdmin
        .from('permissoes_cargo')
        .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
        .eq('cargo_id', cargoId)
      if (error) throw error
      cargoPerms = data || []
    }

    // 2. Se não encontrar (cargo não possui permissões), usar permissões individuais em permissoes_usuario
    let userPerms: any[] = []
    if (cargoPerms.length === 0) {
      const { data: uData, error: userPermsError } = await supabaseAdmin
        .from('permissoes_usuario')
        .select('menu_id, pode_ver, pode_criar, pode_editar, pode_deletar')
        .eq('user_id', targetUserId)

      if (userPermsError) throw userPermsError
      userPerms = uData || []
    }

    // Retornar permissões combinadas para todos os menus
    const permissions = (menus || []).map((menu: any) => {
      const parentMenu = menu.menu_filho
        ? (menus || []).find((m: any) => m.nome === menu.menu_pai && !m.menu_filho)
        : null

      const cargoP = cargoPerms.find((p: any) => p.menu_id === menu.id)
      const userP = userPerms.find((p: any) => p.menu_id === menu.id)

      const parentCargoP = parentMenu
        ? cargoPerms.find((p: any) => p.menu_id === parentMenu.id)
        : null
      const parentUserP = parentMenu
        ? userPerms.find((p: any) => p.menu_id === parentMenu.id)
        : null

      const resolvePerm = (field: string) => {
        // Se temos permissões de cargo mapeadas, aplicamos apenas regras atreladas ao cargo
        if (cargoPerms.length > 0) {
          if (cargoP && cargoP[field] !== undefined) return cargoP[field]
          if (parentCargoP && parentCargoP[field] === true) return true
          return false
        }

        // Se não temos regras de cargo, aplicamos regras individuais do usuário
        if (userPerms.length > 0) {
          if (userP && userP[field] !== undefined) return userP[field]
          if (parentUserP && parentUserP[field] === true) return true
          return false
        }

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

    // Adicionar resposta ao cache da edge function
    permissionsCache.set(targetUserId, { data: permissions, timestamp: Date.now() })

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
