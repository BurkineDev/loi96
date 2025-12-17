import { redirect } from "next/navigation";
import { getCurrentUser, getSubscriptionInfo } from "@/app/actions/user";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

/**
 * Layout pour toutes les pages du dashboard
 * Vérifie l'authentification et affiche la navigation
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const subscriptionInfo = await getSubscriptionInfo();

  if (!user) {
    redirect("/sign-in");
  }

  const isPaidUser =
    user.plan !== "FREE" &&
    (user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING");

  const freeChecksRemaining = isPaidUser
    ? Infinity
    : Math.max(0, 5 - user.checksUsed);

  const headerUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    isSubscribed: isPaidUser,
    freeChecksRemaining: isPaidUser ? 999 : freeChecksRemaining,
    canAnalyze: subscriptionInfo?.canAnalyze ?? false,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={headerUser} />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
