import { createClient } from '@supabase/supabase-js';

// Declaração para TypeScript não reclamar das constantes globais injetadas pelo Vite
declare global {
    const __VITE_SUPABASE_URL__: string | undefined;
    const __VITE_SUPABASE_ANON_KEY__: string | undefined;
}

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || (typeof __VITE_SUPABASE_URL__ !== 'undefined' ? __VITE_SUPABASE_URL__ : '');
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (typeof __VITE_SUPABASE_ANON_KEY__ !== 'undefined' ? __VITE_SUPABASE_ANON_KEY__ : '');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase URL or Anon Key is missing!', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        mode: (import.meta as any).env.MODE
    });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
