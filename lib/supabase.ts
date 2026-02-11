import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep app booting for scaffold/demo mode
  console.warn('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl ?? 'https://example.supabase.co', supabaseAnonKey ?? 'public-anon-key');
