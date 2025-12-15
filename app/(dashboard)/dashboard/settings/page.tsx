import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { DangerZone } from "@/components/dashboard/danger-zone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Gérez votre profil et vos paramètres de compte",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

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

        {/* Profil */}
        <TabsContent value="profile">
          <SettingsForm
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }}
          />
        </TabsContent>

        {/* Abonnement */}
        <TabsContent value="subscription">
          <SubscriptionCard
            user={{
              id: user.id,
              plan: user.plan,
              isSubscribed: user.isSubscribed,
              lemonSqueezyCustomerId: user.lemonSqueezyCustomerId,
              currentPeriodEnd: user.currentPeriodEnd,
              freeChecksRemaining: user.freeChecksRemaining,
              freeChecksUsed: user.freeChecksUsed,
            }}
          />
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <DangerZone userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
