// ===========================================
// Intégration Lemon Squeezy pour ConformLoi96
// ===========================================

import crypto from "crypto";

// ===========================================
// Configuration
// ===========================================

const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";

export const PLANS = {
  FREE: {
    name: "Gratuit",
    price: 0,
    checksPerMonth: 5,
    features: [
      "5 vérifications par mois",
      "Analyse IA complète",
      "Checklist des problèmes",
      "Suggestions de corrections",
    ],
  },
  PRO: {
    name: "Pro",
    price: 1900, // En centimes (19.00$)
    checksPerMonth: -1, // Illimité
    variantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
    features: [
      "Vérifications illimitées",
      "Tout du plan Gratuit",
      "Génération PDF corrigé",
      "Historique complet",
      "Support prioritaire",
    ],
  },
} as const;

// ===========================================
// Client API Lemon Squeezy
// ===========================================

interface LemonSqueezyResponse<T> {
  data: T;
  meta?: {
    page?: {
      currentPage: number;
      from: number;
      lastPage: number;
      perPage: number;
      to: number;
      total: number;
    };
  };
}

interface LemonSqueezyCheckout {
  type: "checkouts";
  id: string;
  attributes: {
    store_id: number;
    variant_id: number;
    custom_price: number | null;
    product_options: {
      name: string;
      description: string;
      media: string[];
      redirect_url: string;
      receipt_button_text: string;
      receipt_link_url: string;
      receipt_thank_you_note: string;
      enabled_variants: number[];
    };
    checkout_options: {
      embed: boolean;
      media: boolean;
      logo: boolean;
      desc: boolean;
      discount: boolean;
      dark: boolean;
      subscription_preview: boolean;
      button_color: string;
    };
    checkout_data: {
      email: string;
      name: string;
      billing_address: object;
      tax_number: string;
      discount_code: string;
      custom: Record<string, string>;
      variant_quantities: object[];
    };
    preview: object;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
    url: string;
  };
}

interface LemonSqueezySubscription {
  type: "subscriptions";
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: "on_trial" | "active" | "paused" | "past_due" | "unpaid" | "cancelled" | "expired";
    status_formatted: string;
    card_brand: string;
    card_last_four: string;
    pause: object | null;
    cancelled: boolean;
    trial_ends_at: string | null;
    billing_anchor: number;
    first_subscription_item: object;
    urls: {
      update_payment_method: string;
      customer_portal: string;
    };
    renews_at: string;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

/**
 * Faire une requête à l'API Lemon Squeezy
 */
async function lemonSqueezyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<LemonSqueezyResponse<T>> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY non configurée");
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Lemon Squeezy API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

// ===========================================
// Fonctions de l'API
// ===========================================

/**
 * Créer une session de checkout
 */
export async function createCheckoutSession(params: {
  email: string;
  userId: string;
  userName?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = PLANS.PRO.variantId;

  if (!storeId || !variantId) {
    throw new Error("Configuration Lemon Squeezy incomplète");
  }

  const response = await lemonSqueezyFetch<LemonSqueezyCheckout>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: params.email,
            name: params.userName || "",
            custom: {
              user_id: params.userId,
            },
          },
          checkout_options: {
            dark: false,
            embed: false,
            media: true,
            logo: true,
          },
          product_options: {
            redirect_url: params.successUrl,
            receipt_button_text: "Retour au tableau de bord",
            receipt_link_url: params.successUrl,
            receipt_thank_you_note: "Merci pour votre abonnement à ConformLoi96 Pro!",
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  return { url: response.data.attributes.url };
}

/**
 * Récupérer un abonnement
 */
export async function getSubscription(
  subscriptionId: string
): Promise<LemonSqueezySubscription> {
  const response = await lemonSqueezyFetch<LemonSqueezySubscription>(
    `/subscriptions/${subscriptionId}`
  );
  return response.data;
}

/**
 * Annuler un abonnement
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await lemonSqueezyFetch(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });
}

/**
 * Obtenir le lien du portail client
 */
export async function getCustomerPortalUrl(
  subscriptionId: string
): Promise<string> {
  const subscription = await getSubscription(subscriptionId);
  return subscription.attributes.urls.customer_portal;
}

// ===========================================
// Vérification des webhooks
// ===========================================

/**
 * Vérifier la signature d'un webhook Lemon Squeezy
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  
  if (!secret) {
    throw new Error("LEMONSQUEEZY_WEBHOOK_SECRET non configuré");
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// ===========================================
// Types pour les webhooks
// ===========================================

export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    type: string;
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id?: number;
      subscription_id?: number;
      variant_id: number;
      product_id: number;
      user_email: string;
      user_name: string;
      status?: string;
      renews_at?: string;
      ends_at?: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
    };
  };
}

export type WebhookEventType =
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_success"
  | "subscription_payment_failed"
  | "order_created"
  | "order_refunded";
