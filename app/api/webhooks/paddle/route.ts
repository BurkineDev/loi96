import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Paddle webhook secret
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";

/**
 * Verify Paddle webhook signature
 */
// Maximum age of webhook signature (5 minutes)
const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000;

function verifyPaddleSignature(
  payload: string,
  signature: string,
  secret: string
): { valid: boolean; error?: string } {
  try {
    // Parse the signature header
    // Format: ts=xxx;h1=xxx
    const parts = signature.split(";");
    const tsMatch = parts[0]?.match(/ts=(\d+)/);
    const h1Match = parts[1]?.match(/h1=(.+)/);

    if (!tsMatch || !h1Match) {
      return { valid: false, error: "Invalid signature format" };
    }

    const timestamp = tsMatch[1];
    const providedSignature = h1Match[1];

    if (!timestamp || !providedSignature) {
      return { valid: false, error: "Missing timestamp or signature" };
    }

    // SECURITY: Prevent replay attacks - reject old signatures
    const signatureTime = parseInt(timestamp, 10) * 1000; // Convert to ms
    const now = Date.now();
    if (now - signatureTime > MAX_WEBHOOK_AGE_MS) {
      return { valid: false, error: "Signature expired (replay attack prevention)" };
    }

    // Recreate the signed payload
    const signedPayload = `${timestamp}:${payload}`;

    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    // Compare signatures using timing-safe comparison
    const valid = crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    );

    return { valid };
  } catch (error) {
    console.error("Signature verification error:", error);
    return { valid: false, error: "Verification failed" };
  }
}

/**
 * Map Paddle subscription status to our enum
 */
function mapSubscriptionStatus(paddleStatus: string): "ACTIVE" | "TRIALING" | "PAST_DUE" | "PAUSED" | "CANCELED" | "FREE" {
  switch (paddleStatus) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "paused":
      return "PAUSED";
    case "canceled":
    case "cancelled":
      return "CANCELED";
    default:
      return "FREE";
  }
}

/**
 * Map Paddle product to our plan
 */
function mapProductToPlan(priceId: string): "STARTER" | "PRO" {
  const starterMonthly = process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID;
  const starterYearly = process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY_PRICE_ID;

  if (priceId === starterMonthly || priceId === starterYearly) {
    return "STARTER";
  }

  return "PRO";
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("paddle-signature");

    // SECURITY: Always require signature verification in production
    if (!PADDLE_WEBHOOK_SECRET) {
      console.error("PADDLE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("Missing paddle-signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const verification = verifyPaddleSignature(payload, signature, PADDLE_WEBHOOK_SECRET);
    if (!verification.valid) {
      console.error("Webhook signature verification failed:", verification.error);
      return NextResponse.json({ error: verification.error || "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType = event.event_type;
    const data = event.data;

    console.log(`Received Paddle webhook: ${eventType}`);

    // Store webhook event for debugging
    await prisma.webhookEvent.create({
      data: {
        eventId: event.event_id || crypto.randomUUID(),
        eventType,
        data: event,
        processed: false,
      },
    });

    // Handle different event types
    switch (eventType) {
      case "subscription.created":
      case "subscription.activated": {
        const customerId = data.customer_id;
        const subscriptionId = data.id;
        const status = data.status;
        const priceId = data.items?.[0]?.price?.id;
        const currentPeriodEnd = data.current_billing_period?.ends_at;
        const trialEndsAt = data.trial?.ends_at;

        // Get user email from customer data
        const customerEmail = data.customer?.email;

        if (!customerEmail) {
          console.error("No customer email in webhook");
          break;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        if (!user) {
          console.error(`User not found for email: ${customerEmail}`);
          break;
        }

        // Update user subscription
        await prisma.user.update({
          where: { id: user.id },
          data: {
            paddleCustomerId: customerId,
            paddleSubscriptionId: subscriptionId,
            plan: mapProductToPlan(priceId || ""),
            subscriptionStatus: mapSubscriptionStatus(status),
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
            trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : null,
          },
        });

        console.log(`Subscription ${subscriptionId} created for user ${user.id}`);
        break;
      }

      case "subscription.updated": {
        const subscriptionId = data.id;
        const status = data.status;
        const priceId = data.items?.[0]?.price?.id;
        const currentPeriodEnd = data.current_billing_period?.ends_at;

        // Find user by subscription ID
        const user = await prisma.user.findUnique({
          where: { paddleSubscriptionId: subscriptionId },
        });

        if (!user) {
          console.error(`User not found for subscription: ${subscriptionId}`);
          break;
        }

        // Update user subscription
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: priceId ? mapProductToPlan(priceId) : undefined,
            subscriptionStatus: mapSubscriptionStatus(status),
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          },
        });

        console.log(`Subscription ${subscriptionId} updated for user ${user.id}`);
        break;
      }

      case "subscription.canceled":
      case "subscription.cancelled": {
        const subscriptionId = data.id;
        const effectiveFrom = data.scheduled_change?.effective_at;

        // Find user by subscription ID
        const user = await prisma.user.findUnique({
          where: { paddleSubscriptionId: subscriptionId },
        });

        if (!user) {
          console.error(`User not found for subscription: ${subscriptionId}`);
          break;
        }

        // If cancellation is immediate, downgrade to free
        if (!effectiveFrom || new Date(effectiveFrom) <= new Date()) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              subscriptionStatus: "CANCELED",
              currentPeriodEnd: null,
              trialEndsAt: null,
            },
          });
        } else {
          // Mark as canceled but keep access until period end
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "CANCELED",
              currentPeriodEnd: new Date(effectiveFrom),
            },
          });
        }

        console.log(`Subscription ${subscriptionId} canceled for user ${user.id}`);
        break;
      }

      case "transaction.completed": {
        // Payment successful
        const customerId = data.customer_id;
        console.log(`Payment completed for customer ${customerId}`);
        break;
      }

      case "transaction.payment_failed": {
        // Payment failed
        const subscriptionId = data.subscription_id;

        if (subscriptionId) {
          const user = await prisma.user.findUnique({
            where: { paddleSubscriptionId: subscriptionId },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: "PAST_DUE",
              },
            });

            console.log(`Payment failed for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Paddle event: ${eventType}`);
    }

    // Mark event as processed
    await prisma.webhookEvent.updateMany({
      where: { eventId: event.event_id },
      data: { processed: true, processedAt: new Date() },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
