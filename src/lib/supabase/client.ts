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
})

// PATCH: Intercept profile select queries to fix legacy cargo queries that cause HTTP 400 errors
const originalFrom = supabase.from.bind(supabase)
// @ts-expect-error - overriding from for runtime compatibility with legacy queries
supabase.from = (relation: any) => {
  const queryBuilder = originalFrom(relation)

  if (relation === 'profiles') {
    const originalSelect = queryBuilder.select.bind(queryBuilder)

    // @ts-expect-error
    queryBuilder.select = (columns?: string, options?: any) => {
      if (
        typeof columns === 'string' &&
        (columns.includes('cargos(') || columns.includes('cargo_id'))
      ) {
        // Replace old cargos relation with new user_cargos relation
        let newColumns = columns.replace(
          /cargos\s*\(\s*nome\s*\)/g,
          'user_cargos(cargo, cargo_id, is_principal)',
        )

        // Ensure user_cargos is queried if cargo_id was requested
        if (columns.includes('cargo_id') && !newColumns.includes('user_cargos')) {
          newColumns += ', user_cargos(cargo, cargo_id, is_principal)'
        }

        // Remove standalone cargo_id from top-level select since it no longer exists in profiles
        newColumns = newColumns.replace(/\bcargo_id\b/g, (match, offset, str) => {
          let openParens = 0
          for (let i = 0; i < offset; i++) {
            if (str[i] === '(') openParens++
            if (str[i] === ')') openParens--
          }
          if (openParens === 0) return '' // Remove top-level cargo_id
          return match // Keep it if it's inside user_cargos(...)
        })

        // Clean up redundant commas
        newColumns = newColumns.replace(/,\s*,/g, ',').replace(/^,|,$/g, '').trim()

        const filterBuilder = originalSelect(newColumns, options)
        const originalThen = filterBuilder.then.bind(filterBuilder)

        // Intercept Promise resolution to map user_cargos back to legacy cargo_id and cargos
        // @ts-expect-error
        filterBuilder.then = function (onfulfilled: any, onrejected: any) {
          return originalThen((res: any) => {
            if (res && res.data) {
              const mapProfile = (p: any) => {
                if (!p || typeof p !== 'object') return p
                if (p.user_cargos && Array.isArray(p.user_cargos)) {
                  const principal =
                    p.user_cargos.find((c: any) => c.is_principal) || p.user_cargos[0]
                  p.cargo_id = principal?.cargo_id || null
                  p.cargos = principal ? { nome: principal.cargo } : null
                }
                return p
              }

              if (Array.isArray(res.data)) {
                res.data = res.data.map(mapProfile)
              } else {
                res.data = mapProfile(res.data)
              }
            }
            if (onfulfilled) return onfulfilled(res)
            return res
          }, onrejected)
        }

        return filterBuilder
      }
      return originalSelect(columns, options)
    }
  }
  return queryBuilder
}
