import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/lemonsqueezy";

/**
 * POST /api/lemonsqueezy/checkout
 * Créer une session Lemon Squeezy Checkout pour l'abonnement Pro
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

    // Vérifier si déjà abonné
    if (
      dbUser.subscriptionStatus === "active" &&
      dbUser.currentPeriodEnd &&
      new Date(dbUser.currentPeriodEnd) > new Date()
    ) {
      return NextResponse.json(
        { error: "Vous êtes déjà abonné au plan Pro" },
        { status: 400 }
      );
    }

    // Créer la session checkout
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCheckoutSession({
      email: dbUser.email,
      userId: dbUser.id,
      userName: dbUser.name || undefined,
      successUrl: `${baseUrl}/dashboard/settings?success=true`,
      cancelUrl: `${baseUrl}/dashboard/settings?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur checkout Lemon Squeezy:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
