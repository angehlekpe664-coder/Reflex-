import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://lvyhyspygwwfvqegiodj.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'sb_publishable_n7wxXk7fRLcvi3PMg_pR7g_G8psPPdm';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
