import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Atualiza a sessão do usuário nos cookies a cada request.
 * Deve ser chamado no middleware.ts para manter a autenticação.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Não escreva código entre createServerClient e supabase.auth.getUser().
    // Um simples erro pode tornar muito difícil depurar problemas com sessões aleatoriamente deslogando.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Rotas protegidas — adicione aqui conforme necessário
    const pathname = request.nextUrl.pathname;

    // Não interceptar a própria página de login admin
    if (pathname === "/admin-login") {
      return supabaseResponse;
    }

    if (
      !user &&
      (pathname.startsWith("/conta") || pathname.startsWith("/admin"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    // Se o Supabase falhar (rede, timeout, etc), deixa o request prosseguir
    // sem proteção de rota ao invés de derrubar o middleware inteiro.
    console.error("[middleware] updateSession error:", e);
  }

  return supabaseResponse;
}
