import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@/lib/lemonsqueezy";

/**
 * DELETE /api/user/delete
 * Supprimer le compte utilisateur
 */
export async function DELETE() {
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

    // Annuler l'abonnement Lemon Squeezy si actif
    if (dbUser.lemonSqueezySubscriptionId) {
      try {
        await cancelSubscription(dbUser.lemonSqueezySubscriptionId);
      } catch (lsError) {
        console.error("Erreur annulation abonnement Lemon Squeezy:", lsError);
        // Continuer la suppression même si l'annulation échoue
      }
    }

    // Supprimer toutes les données de l'utilisateur
    // Les cascades dans Prisma devraient gérer les relations
    await prisma.$transaction([
      // Supprimer les analyses
      prisma.analysis.deleteMany({ where: { userId: user.id } }),
      // Supprimer les documents
      prisma.document.deleteMany({ where: { userId: user.id } }),
      // Supprimer l'utilisateur
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    // Supprimer l'utilisateur de Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (authError) {
      console.error("Erreur suppression auth Supabase:", authError);
      // L'utilisateur a déjà été supprimé de Prisma, on continue
    }

    // Déconnecter l'utilisateur
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
