import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getSubscriptionInfo } from "@/app/actions/user";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Gérez votre profil et vos paramètres de compte",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const subscriptionInfo = await getSubscriptionInfo();

  if (!user) {
    redirect("/sign-in");
  }

  const isPaidUser =
    user.plan !== "FREE" &&
    (user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING");

  const planName = user.plan === "PRO" ? "Pro" : user.plan === "STARTER" ? "Starter" : "Gratuit";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre profil, abonnement et préférences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Abonnement
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Profil - Clerk UserProfile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Votre profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et vos préférences de compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none w-full",
                    navbar: "hidden",
                    pageScrollBox: "p-0",
                  },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abonnement */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Votre abonnement</CardTitle>
              <CardDescription>
                Gérez votre forfait et votre facturation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current plan */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Forfait actuel</p>
                  <p className="text-2xl font-bold text-[#003DA5]">{planName}</p>
                  {user.subscriptionStatus === "TRIALING" && (
                    <p className="text-sm text-muted-foreground">
                      Période d&apos;essai - se termine le{" "}
                      {user.trialEndsAt?.toLocaleDateString("fr-CA")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {isPaidUser ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Analyses illimitées</p>
                      {user.currentPeriodEnd && (
                        <p className="text-xs text-muted-foreground">
                          Prochaine facturation : {user.currentPeriodEnd.toLocaleDateString("fr-CA")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionInfo?.checksRemaining ?? 0} vérifications restantes
                      </p>
                      <p className="text-xs text-muted-foreground">
                        sur 5 ce mois-ci
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upgrade or manage */}
              {isPaidUser ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pour gérer votre abonnement, modifier votre forfait ou annuler,
                    utilisez le portail client Paddle.
                  </p>
                  {user.paddleSubscriptionId && (
                    <Button variant="outline" asChild>
                      <a
                        href={`https://sandbox-customer-portal.paddle.com/subscriptions/${user.paddleSubscriptionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gérer l&apos;abonnement
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Passez à un forfait payant pour des analyses illimitées et des
                    fonctionnalités avancées.
                  </p>
                  <Button asChild className="bg-[#003DA5] hover:bg-[#002d7a]">
                    <Link href="/tarifs">Voir les forfaits</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous pouvez gérer votre mot de passe, vos méthodes de connexion
                  et vos paramètres de sécurité depuis votre profil Clerk ci-dessus.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Suppression de compte :</strong> Pour supprimer définitivement
                    votre compte et toutes vos données, contactez-nous à{" "}
                    <a
                      href="mailto:support@loi96.ca"
                      className="text-[#003DA5] hover:underline"
                    >
                      support@loi96.ca
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
