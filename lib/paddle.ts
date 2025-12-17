// ===========================================
// Paddle Configuration
// ===========================================

export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
export const PADDLE_ENVIRONMENT: "sandbox" | "production" =
  (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") || "sandbox";

// Plan definitions
export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceId: string | null;
  yearlyPriceId: string | null;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour commencer",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: null,
    yearlyPriceId: null,
    features: [
      "5 vérifications par mois",
      "Analyse de conformité de base",
      "Détection de langue",
      "Score de conformité",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Pour les petites entreprises",
    monthlyPrice: 19,
    yearlyPrice: 190,
    monthlyPriceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY_PRICE_ID || "",
    features: [
      "Vérifications illimitées",
      "Analyse de conformité avancée",
      "Suggestions de corrections",
      "Historique des analyses",
      "Support par email",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les grandes entreprises",
    monthlyPrice: 49,
    yearlyPrice: 490,
    monthlyPriceId: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || "",
    yearlyPriceId: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID || "",
    features: [
      "Tout dans Starter",
      "Documents corrigés automatiquement",
      "Export PDF des corrections",
      "Support prioritaire",
      "API access (bientôt)",
    ],
  },
];

// Calculate yearly savings
export function calculateYearlySavings(plan: Plan): {
  savings: number;
  percentage: number;
} {
  if (plan.monthlyPrice === 0) {
    return { savings: 0, percentage: 0 };
  }

  const monthlyTotal = plan.monthlyPrice * 12;
  const savings = monthlyTotal - plan.yearlyPrice;
  const percentage = Math.round((savings / monthlyTotal) * 100);

  return { savings, percentage };
}
