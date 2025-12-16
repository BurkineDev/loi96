import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Webhook secret from Clerk Dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
          console.error("No email found for user:", id);
          return NextResponse.json(
            { error: "No email found" },
            { status: 400 }
          );
        }

        // Create user in database
        await prisma.user.create({
          data: {
            id: id,
            email: primaryEmail,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            plan: "FREE",
            subscriptionStatus: "FREE",
            checksUsed: 0,
            checksResetDate: new Date(),
          },
        });

        console.log(`User created: ${id} (${primaryEmail})`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        // Update user in database
        await prisma.user.update({
          where: { id: id },
          data: {
            email: primaryEmail || undefined,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
          },
        });

        console.log(`User updated: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          console.error("No user ID in delete event");
          return NextResponse.json(
            { error: "No user ID" },
            { status: 400 }
          );
        }

        // Delete user and all related data (cascade)
        await prisma.user.delete({
          where: { id: id },
        });

        console.log(`User deleted: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
