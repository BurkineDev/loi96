import Stripe from "stripe";

// Client Stripe côté serveur (initialisé à la demande)
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export pour compatibilité
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// Configuration des plans
export const PLANS = {
  FREE: {
    name: "Gratuit",
    description: "5 vérifications par mois",
    monthlyPrice: 0,
    yearlyPrice: 0,
    checksPerMonth: 5,
    monthlyPriceId: null,
    yearlyPriceId: null,
    features: [
      "5 vérifications par mois",
      "Analyse de documents PDF, Word, texte",
      "Score de conformité",
      "Suggestions de corrections",
    ],
  },
  STARTER: {
    name: "Starter",
    description: "Vérifications illimitées",
    monthlyPrice: 19,
    yearlyPrice: 190,
    checksPerMonth: Infinity,
    monthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || null,
    yearlyPriceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || null,
    features: [
      "Vérifications illimitées",
      "Analyse de documents PDF, Word, texte",
      "Score de conformité détaillé",
      "Suggestions de corrections",
      "Historique complet",
      "Support par email",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Tout inclus + Support prioritaire",
    monthlyPrice: 49,
    yearlyPrice: 490,
    checksPerMonth: Infinity,
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || null,
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || null,
    features: [
      "Tout de Starter",
      "Analyse d'enseignes commerciales",
      "Export PDF des corrections",
      "Support prioritaire",
      "API access (bientôt)",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

// Helper pour obtenir le price ID en fonction du plan et de l'intervalle
export function getPriceId(planId: PlanType, interval: "monthly" | "yearly"): string | null {
  const plan = PLANS[planId];
  if (!plan) return null;
  return interval === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId;
}
