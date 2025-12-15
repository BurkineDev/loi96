import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Crown, AlertTriangle } from "lucide-react";

interface QuickStatsProps {
  isSubscribed: boolean;
  freeChecksRemaining: number;
}

/**
 * Affiche les statistiques rapides de l'utilisateur
 */
export function QuickStats({ isSubscribed, freeChecksRemaining }: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Statut abonnement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votre forfait</CardTitle>
          <Crown className={`h-4 w-4 ${isSubscribed ? "text-primary" : "text-muted-foreground"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isSubscribed ? "Pro" : "Gratuit"}
          </div>
          {!isSubscribed && (
            <Link href="/dashboard/settings#billing">
              <Button variant="link" className="p-0 h-auto text-sm text-primary">
                Passer au Pro →
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Vérifications restantes */}
      {!isSubscribed && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vérifications restantes
            </CardTitle>
            {freeChecksRemaining <= 1 ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {freeChecksRemaining}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / 5 ce mois
              </span>
            </div>
            {freeChecksRemaining === 0 && (
              <p className="text-xs text-destructive mt-1">
                Passez au Pro pour des vérifications illimitées
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Loi 96 */}
      <Card className={isSubscribed ? "md:col-span-2" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            À propos de la Loi 96
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La Loi 96 exige que le français soit prédominant dans les
            communications commerciales au Québec. Nos analyses vérifient la
            conformité de vos documents.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
