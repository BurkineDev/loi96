"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, Shield, Zap, Crown, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePaddle } from "@/components/paddle/paddle-provider";
import { PLANS, calculateYearlySavings } from "@/lib/paddle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TarifsPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const { user, isSignedIn } = useUser();
  const { openCheckout, isLoaded } = usePaddle();

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      if (isSignedIn) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/sign-up";
      }
      return;
    }

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;

    const priceId = billingInterval === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId;

    if (!priceId) {
      console.error("No price ID for plan:", planId);
      return;
    }

    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      openCheckout(priceId, user.primaryEmailAddress.emailAddress);
    } else {
      // Redirect to sign up first
      window.location.href = `/sign-up?plan=${planId}&interval=${billingInterval}`;
    }
  };

  const faq = [
    {
      question: "Qu'est-ce que la Loi 96?",
      answer: "La Loi 96 (anciennement le projet de loi 96) est une loi québécoise qui renforce la Charte de la langue française. Elle impose aux entreprises d'utiliser le français comme langue prédominante dans leurs communications commerciales, factures, contrats et affichage public.",
    },
    {
      question: "Comment fonctionne la période d'essai?",
      answer: "Lorsque vous vous abonnez à un plan payant, vous bénéficiez automatiquement de 14 jours d'essai gratuit. Vous ne serez facturé qu'après cette période. Vous pouvez annuler à tout moment sans frais pendant l'essai.",
    },
    {
      question: "Puis-je annuler mon abonnement?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vous conserverez l'accès aux fonctionnalités payantes jusqu'à la fin de votre période de facturation en cours.",
    },
    {
      question: "Quels types de documents puis-je analyser?",
      answer: "Vous pouvez analyser des documents PDF, Word (DOCX), fichiers texte, ou simplement coller du texte directement. Cela inclut les factures, contrats, conditions générales, textes marketing, courriels commerciaux, et plus encore.",
    },
    {
      question: "L'analyse est-elle confidentielle?",
      answer: "Oui, vos documents sont traités de manière sécurisée et confidentielle. Nous ne conservons pas le contenu de vos documents au-delà de ce qui est nécessaire pour l'analyse. Consultez notre politique de confidentialité pour plus de détails.",
    },
    {
      question: "Puis-je changer de plan?",
      answer: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Si vous passez à un plan supérieur, la différence sera calculée au prorata. Si vous passez à un plan inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-quebec-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-quebec-blue">Loi96.ca</span>
            </Link>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Button asChild>
                  <Link href="/dashboard">Mon tableau de bord</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Connexion</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Commencer gratuitement</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-quebec-blue/10 text-quebec-blue border-quebec-blue/20">
              Essai gratuit 14 jours
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Des tarifs simples et transparents
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Commencez gratuitement avec 5 vérifications par mois, puis passez à Pro pour des analyses illimitées.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 bg-gray-100 rounded-full">
              <button
                onClick={() => setBillingInterval("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingInterval === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingInterval("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  billingInterval === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annuel
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  -16%
                </Badge>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan, index) => {
              const savings = calculateYearlySavings(plan);
              const price = billingInterval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const priceLabel = billingInterval === "monthly" ? "/mois" : "/an";

              const Icon = plan.id === "free" ? Shield : plan.id === "starter" ? Zap : Crown;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl border-2 p-8 bg-white ${
                    plan.popular
                      ? "border-quebec-blue shadow-xl scale-105"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-quebec-blue text-white">
                      Le plus populaire
                    </Badge>
                  )}

                  <div className="text-center mb-8">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                        plan.popular ? "bg-quebec-blue text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mt-1">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {price === 0 ? "0" : `${price}`}
                      </span>
                      <span className="text-gray-600">$ CAD{priceLabel}</span>
                    </div>
                    {billingInterval === "yearly" && savings.percentage > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Économisez {savings.savings}$/an
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={!isLoaded && plan.id !== "free"}
                    className={`w-full ${
                      plan.popular
                        ? "bg-quebec-blue hover:bg-quebec-blue/90"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {plan.id === "free" ? (
                      <>
                        Commencer gratuitement
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Essayer 14 jours gratuits
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-quebec-blue mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-gray-600">
                Tout ce que vous devez savoir sur Loi96.ca
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faq.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg border px-6"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à assurer votre conformité?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Commencez gratuitement dès maintenant. Aucune carte de crédit requise.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Essayer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-quebec-blue" />
              <span className="font-semibold">Loi96.ca</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/mentions-legales" className="hover:text-gray-900">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="hover:text-gray-900">
                Confidentialité
              </Link>
              <Link href="/conditions-utilisation" className="hover:text-gray-900">
                Conditions d&apos;utilisation
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Loi96.ca. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
