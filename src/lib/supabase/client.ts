// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  let isLegacyQuery = false

  if (
    url.includes('/rest/v1/profiles') &&
    (url.includes('cargos%28nome%29') || url.includes('cargos(nome)'))
  ) {
    isLegacyQuery = true
    url = url
      .replace(/cargos%28nome%29/g, 'user_cargos%28cargo%2Ccargo_id%2Cis_principal%29')
      .replace(/cargos\([^)]+\)/g, 'user_cargos(cargo,cargo_id,is_principal)')
  }

  const requestInput =
    input instanceof Request && isLegacyQuery
      ? new Request(url, input)
      : isLegacyQuery
        ? url
        : input

  const response = await fetch(requestInput, init)

  if (isLegacyQuery && response.ok) {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const cloned = response.clone()
      try {
        const data = await cloned.json()
        const mapLegacy = (p: any) => {
          if (p && p.user_cargos) {
            const principal = p.user_cargos.find((c: any) => c.is_principal) || p.user_cargos[0]
            if (principal) {
              p.cargos = { nome: principal.cargo }
              if (!p.cargo_id) p.cargo_id = principal.cargo_id
            } else {
              p.cargos = null
            }
          }
          return p
        }
        const mapped = Array.isArray(data) ? data.map(mapLegacy) : mapLegacy(data)
        return new Response(JSON.stringify(mapped), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        })
      } catch (e) {
        console.error('Error in customFetch parse:', e)
      }
    }
  }

  return response
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: customFetch,
  },
})
