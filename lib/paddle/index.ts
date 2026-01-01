// ===========================================
// Configuration Paddle Billing
// ===========================================

import { PaddlePlan } from "@/types";

// Environment
export const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production" || "sandbox";
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";

// Price IDs
export const PADDLE_PRICES = {
  starter: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY_PRICE_ID || "",
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || "",
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID || "",
  },
};

// Plans configuration
export const PLANS: PaddlePlan[] = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour découvrir le service",
    monthlyPriceId: "",
    yearlyPriceId: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    checksPerMonth: 5,
    features: [
      "5 vérifications par mois",
      "Analyse IA complète",
      "Suggestions de correction",
      "Historique 30 jours",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Pour les petites entreprises",
    monthlyPriceId: PADDLE_PRICES.starter.monthly,
    yearlyPriceId: PADDLE_PRICES.starter.yearly,
    monthlyPrice: 19,
    yearlyPrice: 192,
    checksPerMonth: "unlimited",
    popular: true,
    features: [
      "Vérifications illimitées",
      "Analyse IA complète",
      "Suggestions de correction",
      "Export PDF conforme",
      "Historique illimité",
      "Support par courriel",
      "Essai gratuit 14 jours",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les entreprises exigeantes",
    monthlyPriceId: PADDLE_PRICES.pro.monthly,
    yearlyPriceId: PADDLE_PRICES.pro.yearly,
    monthlyPrice: 49,
    yearlyPrice: 480,
    checksPerMonth: "unlimited",
    features: [
      "Tout ce qui est dans Starter",
      "Support prioritaire",
      "Export avancé (Word, PDF)",
      "Analyse de lots",
      "API access",
      "Rapports de conformité",
      "Essai gratuit 14 jours",
    ],
  },
];

export function getPlanById(planId: string): PaddlePlan | undefined {
  return PLANS.find((plan) => plan.id === planId);
}

export function getPriceIdForPlan(
  planId: "starter" | "pro",
  interval: "monthly" | "yearly"
): string {
  return PADDLE_PRICES[planId][interval];
}

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(plan: PaddlePlan): {
  savings: number;
  percentage: number;
} {
  if (plan.monthlyPrice === 0) {
    return { savings: 0, percentage: 0 };
  }

  const yearlyIfMonthly = plan.monthlyPrice * 12;
  const savings = yearlyIfMonthly - plan.yearlyPrice;
  const percentage = Math.round((savings / yearlyIfMonthly) * 100);

  return { savings, percentage };
}
