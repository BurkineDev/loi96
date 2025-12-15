import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy";

/**
 * POST /api/lemonsqueezy/portal
 * Obtenir le lien vers le portail client Lemon Squeezy
 */
export async function POST() {
  try {
    // Vérifier l'authentification
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis la base de données
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier qu'il a un abonnement
    if (!dbUser.lemonSqueezySubscriptionId) {
      return NextResponse.json(
        { error: "Aucun abonnement trouvé" },
        { status: 400 }
      );
    }

    // Obtenir l'URL du portail client
    const portalUrl = await getCustomerPortalUrl(dbUser.lemonSqueezySubscriptionId);

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Erreur portal Lemon Squeezy:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'accès au portail de facturation" },
      { status: 500 }
    );
  }
}
