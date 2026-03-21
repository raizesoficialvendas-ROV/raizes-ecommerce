import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Cria um cliente Supabase para uso no lado do servidor (Server Components, Route Handlers, Server Actions).
 * Gerencia cookies automaticamente para manter a sessão do usuário.
 * Inclui timeout de 10s em cada fetch para evitar que queries travem o SSR.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll foi chamado de um Server Component.
            // Pode ser ignorado se você tiver middleware atualizando sessões.
          }
        },
      },
    }
  );
}
