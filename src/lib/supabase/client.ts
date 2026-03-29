// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: async (url, options) => {
      let requestUrl = url.toString()
      const isProfilesRequest = requestUrl.includes('/rest/v1/profiles')
      const hasObsoleteCargos = requestUrl.includes('cargos%28') || requestUrl.includes('cargos(')

      if (isProfilesRequest && hasObsoleteCargos) {
        try {
          const urlObj = new URL(requestUrl)
          const selectParam = urlObj.searchParams.get('select')

          if (selectParam && selectParam.includes('cargos(')) {
            let newSelect = selectParam

            // Remove obsolete cargo_id column
            newSelect = newSelect.replace(/\bcargo_id\s*,?/g, '')

            // Replace obsolete cargos() relation with new user_cargos relation
            if (!newSelect.includes('user_cargos(')) {
              newSelect = newSelect.replace(
                /cargos\s*\(\s*nome\s*\)/g,
                'user_cargos(cargo_id,cargo,is_principal)',
              )
            } else {
              // If user_cargos is already there, just remove cargos()
              newSelect = newSelect.replace(/cargos\s*\(\s*nome\s*\)\s*,?/g, '')
            }

            // Clean up possible trailing or double commas
            newSelect = newSelect.replace(/,\s*,/g, ',').replace(/,\s*$/g, '')

            urlObj.searchParams.set('select', newSelect)
            requestUrl = urlObj.toString()
          }
        } catch (err) {
          // Fallback if URL parsing fails
          requestUrl = requestUrl
            .replace(/cargo_id%2C/g, '')
            .replace(/%2Ccargo_id/g, '')
            .replace(/cargos%28nome%29/g, 'user_cargos%28cargo_id%2Ccargo%2Cis_principal%29')
        }
      }

      const response = await fetch(requestUrl, options)

      // Re-map the response data so legacy frontend components receive the expected properties
      if (isProfilesRequest && hasObsoleteCargos && response.ok) {
        const clonedResponse = response.clone()
        try {
          const data = await clonedResponse.json()

          const mapProfile = (p: any) => {
            if (p && p.user_cargos !== undefined) {
              const principal = Array.isArray(p.user_cargos)
                ? p.user_cargos.find((c: any) => c.is_principal) || p.user_cargos[0]
                : null

              // Restore properties expected by frontend components
              p.cargo_id = principal?.cargo_id || null
              p.cargos = principal ? { nome: principal.cargo } : null
            }
            return p
          }

          const mappedData = Array.isArray(data) ? data.map(mapProfile) : mapProfile(data)

          return new Response(JSON.stringify(mappedData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          })
        } catch (e) {
          // Ignore parse errors, return original response
          return response
        }
      }

      return response
    },
  },
})
