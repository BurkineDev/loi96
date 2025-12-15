import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Route callback pour OAuth (Google)
 * Gère la redirection après authentification externe
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();

    // Échanger le code contre une session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Créer ou mettre à jour l'utilisateur dans Prisma
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
            freeChecksUsed: 0,
            freeChecksResetAt: new Date(),
          },
        });
      } catch (prismaError) {
        console.error("Erreur upsert user Prisma:", prismaError);
      }

      // Rediriger vers la page demandée
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur, rediriger vers la page de connexion
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
