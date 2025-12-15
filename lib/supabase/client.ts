// ===========================================
// Client Supabase pour Client Components
// ===========================================

import { createBrowserClient } from "@supabase/ssr";

/**
 * Crée un client Supabase pour les Client Components
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Alias pour la compatibilité
 */
export const createClient = createSupabaseBrowserClient;
