import { Metadata } from "next";
import { getUserStats } from "@/app/actions/user";
import { DocumentUploader } from "@/components/dashboard/document-uploader";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Analysez vos documents pour la conformité à la Loi 96",
};

/**
 * Page principale du dashboard
 * Permet d'uploader des documents et de voir les analyses récentes
 */
export default async function DashboardPage() {
  const stats = await getUserStats();

  if (!stats) return null;

  const { user, subscriptionInfo, totalAnalyses, avgComplianceScore, recentAnalyses } = stats;
  const userName = user.firstName || user.email.split("@")[0];
  const isPaidUser = user.plan !== "FREE";

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Vérifiez la conformité de vos documents à la Loi 96.
        </p>
      </div>

      {/* Stats rapides */}
      <QuickStats
        checksUsed={subscriptionInfo?.checksUsed || 0}
        checksLimit={subscriptionInfo?.checksLimit || 5}
        checksRemaining={subscriptionInfo?.checksRemaining || 0}
        totalAnalyses={totalAnalyses}
        avgScore={avgComplianceScore}
        plan={user.plan}
      />

      {/* Zone d'upload */}
      <DocumentUploader
        canAnalyze={subscriptionInfo?.canAnalyze || false}
        checksRemaining={subscriptionInfo?.checksRemaining || 0}
        isPaidUser={isPaidUser}
      />

      {/* Carte upgrade pour utilisateurs gratuits */}
      {!isPaidUser && (
        <UpgradeCard
          checksUsed={subscriptionInfo?.checksUsed || 0}
          checksLimit={5}
        />
      )}

      {/* Analyses récentes */}
      <RecentAnalyses analyses={recentAnalyses} />
    </div>
  );
}
