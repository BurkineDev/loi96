import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyWebhookSignature,
  type LemonSqueezyWebhookEvent,
  type WebhookEventType,
} from "@/lib/lemonsqueezy";

/**
 * POST /api/webhooks/lemonsqueezy
 * Gérer les webhooks Lemon Squeezy (abonnements, paiements, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature manquante" },
        { status: 400 }
      );
    }

    // Vérifier la signature
    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      console.error("Signature webhook invalide");
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 400 }
      );
    }

    // Parser l'événement
    const event: LemonSqueezyWebhookEvent = JSON.parse(body);
    const eventType = event.meta.event_name as WebhookEventType;
    const userId = event.meta.custom_data?.user_id;

    console.log(`Webhook Lemon Squeezy reçu: ${eventType}`, { userId });

    // Traiter l'événement selon son type
    switch (eventType) {
      case "subscription_created":
        await handleSubscriptionCreated(event, userId);
        break;

      case "subscription_updated":
        await handleSubscriptionUpdated(event, userId);
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionEnded(event, userId);
        break;

      case "subscription_resumed":
      case "subscription_unpaused":
        await handleSubscriptionResumed(event, userId);
        break;

      case "subscription_payment_success":
        await handlePaymentSuccess(event, userId);
        break;

      case "subscription_payment_failed":
        await handlePaymentFailed(event, userId);
        break;

      default:
        console.log(`Événement non géré: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Lemon Squeezy:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// ===========================================
// Handlers pour chaque type d'événement
// ===========================================

/**
 * Abonnement créé
 */
async function handleSubscriptionCreated(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const { attributes } = event.data;
  
  // Trouver l'utilisateur par ID personnalisé ou email
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findUnique({ where: { email: attributes.user_email } });

  if (!user) {
    console.error("Utilisateur non trouvé pour l'abonnement:", attributes.user_email);
    return;
  }

  // Mettre à jour l'utilisateur
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "PRO",
      lemonSqueezyCustomerId: String(attributes.customer_id),
      lemonSqueezySubscriptionId: event.data.id,
      subscriptionStatus: attributes.status || "active",
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
    },
  });

  console.log(`Abonnement créé pour ${user.email}`);
}

/**
 * Abonnement mis à jour
 */
async function handleSubscriptionUpdated(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const { attributes } = event.data;
  const subscriptionId = event.data.id;

  // Trouver l'utilisateur
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionId },
      });

  if (!user) {
    console.error("Utilisateur non trouvé pour mise à jour abonnement");
    return;
  }

  // Déterminer le plan selon le statut
  const isActive = attributes.status === "active" || attributes.status === "on_trial";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: isActive ? "PRO" : "FREE",
      subscriptionStatus: attributes.status || "active",
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
    },
  });

  console.log(`Abonnement mis à jour pour ${user.email}: ${attributes.status}`);
}

/**
 * Abonnement terminé (annulé ou expiré)
 */
async function handleSubscriptionEnded(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const subscriptionId = event.data.id;

  // Trouver l'utilisateur
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionId },
      });

  if (!user) {
    console.error("Utilisateur non trouvé pour annulation abonnement");
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      subscriptionStatus: "cancelled",
      currentPeriodEnd: null,
    },
  });

  console.log(`Abonnement annulé pour ${user.email}`);
}

/**
 * Abonnement réactivé
 */
async function handleSubscriptionResumed(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const { attributes } = event.data;
  const subscriptionId = event.data.id;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionId },
      });

  if (!user) {
    console.error("Utilisateur non trouvé pour réactivation abonnement");
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "PRO",
      subscriptionStatus: "active",
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
    },
  });

  console.log(`Abonnement réactivé pour ${user.email}`);
}

/**
 * Paiement réussi
 */
async function handlePaymentSuccess(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const { attributes } = event.data;
  const subscriptionId = event.data.id;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionId },
      });

  if (!user) return;

  // Mettre à jour la date de fin de période
  if (attributes.renews_at) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentPeriodEnd: new Date(attributes.renews_at),
        subscriptionStatus: "active",
      },
    });
  }

  console.log(`Paiement réussi pour ${user.email}`);
}

/**
 * Paiement échoué
 */
async function handlePaymentFailed(
  event: LemonSqueezyWebhookEvent,
  userId?: string
) {
  const subscriptionId = event.data.id;

  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : await prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionId },
      });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "past_due",
    },
  });

  // TODO: Envoyer un email de notification
  console.warn(`Paiement échoué pour ${user.email}`);
}
