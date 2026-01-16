import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Force injection using global constants to avoid import.meta.env conflicts during build
      '__VITE_SUPABASE_URL__': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      '__VITE_SUPABASE_ANON_KEY__': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      '__VITE_GROQ_API_KEY__': JSON.stringify(env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY),
      '__VITE_CLAUDE_API_KEY__': JSON.stringify(env.VITE_CLAUDE_API_KEY || process.env.VITE_CLAUDE_API_KEY),
      '__VITE_OPENAI_API_KEY__': JSON.stringify(env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
