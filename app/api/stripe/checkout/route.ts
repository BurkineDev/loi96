import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, getPriceId, PlanType } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { planId, interval } = await req.json();

    if (!planId || !interval) {
      return NextResponse.json(
        { error: "Plan ID et intervalle requis" },
        { status: 400 }
      );
    }

    // Obtenir le price ID depuis la configuration
    const priceId = getPriceId(planId as PlanType, interval);

    if (!priceId) {
      return NextResponse.json(
        { error: "Prix non configuré pour ce plan. Veuillez contacter le support." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Créer ou récupérer le client Stripe
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      // Sauvegarder le customerId
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tarifs?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: user.id,
          planId: planId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du checkout" },
      { status: 500 }
    );
  }
}
