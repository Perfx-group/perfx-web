import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.')
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
