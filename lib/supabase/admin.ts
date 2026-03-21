import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Cria um cliente Supabase com service role (ignora RLS).
 * USO EXCLUSIVO em Server Actions e Route Handlers do painel admin.
 * NUNCA expor no cliente browser.
 * Inclui timeout de 10s no fetch para evitar travamentos.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10_000);

          return fetch(input, {
            ...init,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
    }
  );
}
