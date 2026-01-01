"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const FREE_CHECKS_PER_MONTH = parseInt(process.env.FREE_CHECKS_PER_MONTH || "5");

/**
 * Get current user from database (synced with Clerk)
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // If user doesn't exist in DB, create from Clerk data
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
      create: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        plan: "FREE",
        subscriptionStatus: "FREE",
        checksUsed: 0,
        checksResetDate: new Date(),
      },
    });
  }

  // Check if we need to reset monthly checks
  const now = new Date();
  const resetDate = new Date(user.checksResetDate);

  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    // Reset checks for the new month
    user = await prisma.user.update({
      where: { id: userId },
      data: {
        checksUsed: 0,
        checksResetDate: new Date(),
      },
    });
  }

  return user;
}

/**
 * Get user subscription info
 */
export async function getSubscriptionInfo() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const isPaid = user.plan !== "FREE" &&
    (user.subscriptionStatus === "ACTIVE" || user.subscriptionStatus === "TRIALING");

  const checksLimit = isPaid ? Infinity : FREE_CHECKS_PER_MONTH;
  const checksRemaining = isPaid ? Infinity : Math.max(0, FREE_CHECKS_PER_MONTH - user.checksUsed);

  return {
    plan: user.plan,
    status: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
    trialEndsAt: user.trialEndsAt,
    checksUsed: user.checksUsed,
    checksLimit,
    checksRemaining,
    canAnalyze: checksRemaining > 0 || isPaid,
  };
}

/**
 * Increment checks used (called after each analysis)
 */
export async function incrementChecksUsed() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Non authentifié");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  // Don't increment for paid users
  if (user.plan !== "FREE" &&
      (user.subscriptionStatus === "ACTIVE" || user.subscriptionStatus === "TRIALING")) {
    return { success: true, checksUsed: user.checksUsed };
  }

  // Check if user has remaining checks
  if (user.checksUsed >= FREE_CHECKS_PER_MONTH) {
    throw new Error("Vous avez atteint votre limite de vérifications gratuites ce mois-ci. Passez à Pro pour continuer!");
  }

  // Increment checks
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      checksUsed: { increment: 1 },
    },
  });

  revalidatePath("/dashboard");

  return {
    success: true,
    checksUsed: updatedUser.checksUsed,
    checksRemaining: FREE_CHECKS_PER_MONTH - updatedUser.checksUsed,
  };
}

/**
 * Check if user can perform analysis
 */
export async function canPerformAnalysis() {
  const subscriptionInfo = await getSubscriptionInfo();

  if (!subscriptionInfo) {
    return { canAnalyze: false, reason: "Non authentifié" };
  }

  if (!subscriptionInfo.canAnalyze) {
    return {
      canAnalyze: false,
      reason: `Vous avez utilisé vos ${FREE_CHECKS_PER_MONTH} vérifications gratuites ce mois-ci. Passez à Pro pour continuer!`,
      checksUsed: subscriptionInfo.checksUsed,
      checksLimit: subscriptionInfo.checksLimit,
    };
  }

  return {
    canAnalyze: true,
    checksUsed: subscriptionInfo.checksUsed,
    checksRemaining: subscriptionInfo.checksRemaining,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Non authentifié");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return updatedUser;
}

/**
 * Get user stats for dashboard
 */
export async function getUserStats() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [user, totalAnalyses, recentAnalyses, avgScore] = await Promise.all([
    getCurrentUser(),
    prisma.analysis.count({
      where: { userId },
    }),
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        document: true,
      },
    }),
    prisma.analysis.aggregate({
      where: { userId },
      _avg: {
        complianceScore: true,
      },
    }),
  ]);

  if (!user) return null;

  const subscriptionInfo = await getSubscriptionInfo();

  return {
    user,
    subscriptionInfo,
    totalAnalyses,
    avgComplianceScore: Math.round(avgScore._avg.complianceScore || 0),
    recentAnalyses,
  };
}
