import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileCheck,
  Crown,
  AlertTriangle,
  TrendingUp,
  Infinity,
  Zap,
} from "lucide-react";

interface QuickStatsProps {
  checksUsed: number;
  checksLimit: number;
  checksRemaining: number;
  totalAnalyses: number;
  avgScore: number;
  plan: string;
}

/**
 * Affiche les statistiques rapides de l'utilisateur
 */
export function QuickStats({
  checksUsed,
  checksLimit,
  checksRemaining,
  totalAnalyses,
  avgScore,
  plan,
}: QuickStatsProps) {
  const isPaid = plan !== "FREE";
  const usagePercentage = isPaid ? 0 : Math.round((checksUsed / checksLimit) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Statut abonnement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votre forfait</CardTitle>
          {isPaid ? (
            <Crown className="h-4 w-4 text-yellow-500" />
          ) : (
            <Zap className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {plan === "FREE" ? "Gratuit" : plan === "STARTER" ? "Starter" : "Pro"}
          </div>
          {!isPaid && (
            <Link href="/tarifs">
              <Button variant="link" className="p-0 h-auto text-sm text-quebec-blue">
                Passer à Pro →
              </Button>
            </Link>
          )}
          {isPaid && plan === "STARTER" && (
            <p className="text-xs text-muted-foreground mt-1">
              Vérifications illimitées
            </p>
          )}
          {isPaid && plan === "PRO" && (
            <p className="text-xs text-muted-foreground mt-1">
              Support prioritaire inclus
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vérifications restantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isPaid ? "Vérifications" : "Vérifications restantes"}
          </CardTitle>
          {isPaid ? (
            <Infinity className="h-4 w-4 text-green-500" />
          ) : checksRemaining <= 1 ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          {isPaid ? (
            <>
              <div className="text-2xl font-bold text-green-600">
                Illimitées
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aucune limite mensuelle
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {checksRemaining}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / {checksLimit}
                </span>
              </div>
              <Progress
                value={usagePercentage}
                className="h-2 mt-2"
              />
              {checksRemaining === 0 && (
                <p className="text-xs text-destructive mt-2">
                  Passez à Starter pour continuer
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Total analyses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Documents analysés
          </CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAnalyses}</div>
          <p className="text-xs text-muted-foreground mt-1">
            au total
          </p>
        </CardContent>
      </Card>

      {/* Score moyen */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Score moyen
          </CardTitle>
          <TrendingUp className={`h-4 w-4 ${avgScore >= 70 ? "text-green-500" : avgScore >= 50 ? "text-yellow-500" : "text-red-500"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAnalyses > 0 ? `${avgScore}%` : "-"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalAnalyses > 0
              ? avgScore >= 80
                ? "Excellent!"
                : avgScore >= 60
                  ? "Peut être amélioré"
                  : "Nécessite attention"
              : "Aucune analyse"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
