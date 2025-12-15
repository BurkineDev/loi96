import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/auth";
import { DocumentUploader } from "@/components/dashboard/document-uploader";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Analysez vos documents pour la conformité à la Loi 96",
};

/**
 * Page principale du dashboard
 * Permet d'uploader des documents et de voir les analyses récentes
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Vérifiez la conformité de vos documents à la Loi 96.
        </p>
      </div>

      {/* Stats rapides */}
      <QuickStats
        isSubscribed={user.isSubscribed}
        freeChecksRemaining={user.freeChecksRemaining}
      />

      {/* Zone d'upload */}
      <DocumentUploader
        isSubscribed={user.isSubscribed}
        freeChecksRemaining={user.freeChecksRemaining}
      />

      {/* Analyses récentes */}
      <RecentAnalyses />
    </div>
  );
}
