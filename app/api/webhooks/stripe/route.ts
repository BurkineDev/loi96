import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log(`Received Stripe webhook: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  // Récupérer les détails de l'abonnement
  const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
  const priceId = subscriptionData.items.data[0]?.price.id;

  if (!priceId) {
    console.error("No price ID found in subscription");
    return;
  }

  // Déterminer le plan
  const plan = getPlanFromPriceId(priceId);

  // Mettre à jour l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      plan,
      subscriptionStatus: "ACTIVE",
    },
  });

  console.log(`Checkout completed for user ${userId}, plan: ${plan}`);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) {
    console.error("No price ID found in subscription");
    return;
  }

  const plan = getPlanFromPriceId(priceId);

  // Trouver l'utilisateur par customerId
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error(`User not found for customer: ${customerId}`);
    return;
  }

  // Mapper le statut Stripe vers notre enum
  const statusMap: Record<string, "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "PAUSED"> = {
    active: "ACTIVE",
    trialing: "TRIALING",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    paused: "PAUSED",
  };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      subscriptionStatus: statusMap[subscription.status] || "ACTIVE",
    },
  });

  console.log(`Subscription updated for user ${user.id}, status: ${subscription.status}`);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error(`User not found for customer: ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      subscriptionStatus: "CANCELED",
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
    },
  });

  console.log(`Subscription canceled for user ${user.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error(`User not found for customer: ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "PAST_DUE",
    },
  });

  console.log(`Payment failed for user ${user.id}`);
}

function getPlanFromPriceId(priceId: string): "STARTER" | "PRO" {
  const starterPriceIds = [
    process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
  ];

  if (starterPriceIds.includes(priceId)) {
    return "STARTER";
  }
  return "PRO";
}
