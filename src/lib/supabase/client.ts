// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Fallback values provided to prevent application crash during preview loading
// when environment variables might not be fully injected yet.
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://eisawcnuqtroudyeqcqn.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpc2F3Y251cXRyb3VkeWVxY3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzI1MjYsImV4cCI6MjA4ODgwODUyNn0.VwKBt0nuJUvyp8GpXCooU0tiqGc_BANecRi9x0rV-mw'

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
