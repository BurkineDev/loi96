"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  CreditCard, 
  Check, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  Calendar,
  FileCheck
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface SubscriptionCardProps {
  user: {
    id: string;
    plan: "FREE" | "PRO";
    isSubscribed: boolean;
    lemonSqueezyCustomerId: string | null;
    currentPeriodEnd: Date | null;
    freeChecksRemaining: number;
    freeChecksUsed: number;
  };
}

export function SubscriptionCard({ user }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isManageLoading, setIsManageLoading] = useState(false);
  const { toast } = useToast();

  const freeChecksLimit = parseInt(process.env.NEXT_PUBLIC_FREE_CHECKS_PER_MONTH || "5", 10);
  const usagePercentage = (user.freeChecksUsed / freeChecksLimit) * 100;

  // Créer une session checkout Lemon Squeezy
  async function handleUpgrade() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de la session");
      }

      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Gérer l'abonnement via le portail Lemon Squeezy
  async function handleManageSubscription() {
    setIsManageLoading(true);

    try {
      const response = await fetch("/api/lemonsqueezy/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'accès au portail");
      }

      // Rediriger vers le portail Stripe
      window.location.href = data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsManageLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Carte du plan actuel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Votre abonnement
              </CardTitle>
              <CardDescription>
                Gérez votre plan et votre facturation
              </CardDescription>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              user.isSubscribed 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {user.isSubscribed ? "Pro" : "Gratuit"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Utilisation */}
          {!user.isSubscribed && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Vérifications ce mois-ci
                </span>
                <span className="font-medium">
                  {user.freeChecksUsed} / {freeChecksLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {user.freeChecksRemaining > 0 
                  ? `Il vous reste ${user.freeChecksRemaining} vérification${user.freeChecksRemaining > 1 ? "s" : ""} gratuite${user.freeChecksRemaining > 1 ? "s" : ""}`
                  : "Vous avez utilisé toutes vos vérifications gratuites ce mois-ci"}
              </p>
            </div>
          )}

          {/* Info abonnement Pro */}
          {user.isSubscribed && user.currentPeriodEnd && (
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Prochain renouvellement</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.currentPeriodEnd)}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {user.isSubscribed ? (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isManageLoading}
              >
                {isManageLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Gérer l&apos;abonnement
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Passer au forfait Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparaison des plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan Gratuit */}
        <Card className={cn(!user.isSubscribed && "ring-2 ring-primary")}>
          <CardHeader>
            <CardTitle>Gratuit</CardTitle>
            <CardDescription>Pour découvrir ConformLoi96</CardDescription>
            <div className="pt-2">
              <span className="text-3xl font-bold">0$</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">5 vérifications par mois</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Analyse IA complète</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Checklist des problèmes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Suggestions de corrections</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Plan Pro */}
        <Card className={cn(
          user.isSubscribed && "ring-2 ring-primary",
          "relative overflow-hidden"
        )}>
          {!user.isSubscribed && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                Populaire
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Pour les professionnels</CardDescription>
            <div className="pt-2">
              <span className="text-3xl font-bold">19$</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Vérifications illimitées</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Tout du plan Gratuit</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Génération PDF corrigé</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Historique complet</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Support prioritaire</span>
              </li>
            </ul>
            
            {!user.isSubscribed && (
              <Button 
                className="w-full mt-6" 
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Passer au Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
