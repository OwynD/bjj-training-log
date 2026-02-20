import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../database.types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build time
    if (typeof window === 'undefined') {
      return null as any
    }
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

export type TypedSupabaseClient = ReturnType<typeof createClient>
