import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey){
    console.error('Missing Supabase env vars. Ensure .env is at project root and restart dev server.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');