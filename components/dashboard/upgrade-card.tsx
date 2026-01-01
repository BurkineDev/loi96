"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UpgradeCardProps {
  checksUsed: number;
  checksLimit: number;
}

export function UpgradeCard({ checksUsed, checksLimit }: UpgradeCardProps) {
  const usagePercentage = Math.round((checksUsed / checksLimit) * 100);
  const isLowOnChecks = checksUsed >= checksLimit - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden ${isLowOnChecks ? "border-yellow-400 bg-yellow-50/50" : "border-quebec-blue/20 bg-gradient-to-br from-quebec-blue/5 to-white"}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-quebec-blue/10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-quebec-blue" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isLowOnChecks
                    ? "Vous êtes presque à court de vérifications!"
                    : "Passez à Starter pour des analyses illimitées"}
                </CardTitle>
                <CardDescription>
                  {checksUsed} / {checksLimit} vérifications utilisées ce mois-ci
                </CardDescription>
              </div>
            </div>
            {isLowOnChecks && (
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={usagePercentage} className="h-2" />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Avantages */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Avec le forfait Starter:
              </p>
              <ul className="space-y-1.5">
                {[
                  "Vérifications illimitées",
                  "Export PDF conforme",
                  "Historique complet",
                  "Essai gratuit 14 jours",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col justify-center items-center md:items-end gap-2">
              <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-quebec-blue">19$ <span className="text-sm font-normal text-gray-500">CAD/mois</span></p>
                <p className="text-xs text-gray-500">ou 192$/an (économisez 16%)</p>
              </div>
              <Button asChild size="lg" className="bg-quebec-blue hover:bg-quebec-blue/90">
                <Link href="/tarifs">
                  Essayer 14 jours gratuits
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
