import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isConfigured = supabaseUrl && supabaseUrl.startsWith("http") && supabaseAnonKey;

if (!isConfigured) {
  console.warn(
    "Supabase credentials missing or invalid. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file and restart Vite."
  );
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
          error: null
        }),
        signInWithPassword: async () => ({
          data: { session: null },
          error: new Error("Credentials missing. Make sure VITE_SUPABASE_URL is set in your env and Vite is restarted.")
        }),
        signOut: async () => ({ error: null })
      }
    } as any);
