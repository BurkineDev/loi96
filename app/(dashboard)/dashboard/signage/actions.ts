"use server";

import { auth } from "@clerk/nextjs/server";
import { analyzeSignageForLoi96 } from "@/lib/ai/analyzer";
import { canPerformAnalysis, incrementChecksUsed } from "@/app/actions/user";
import { rateLimiters } from "@/lib/security/rate-limit";
import { sanitizeForAI, logSuspiciousActivity } from "@/lib/security/prompt-sanitizer";

export async function analyzeSignage(description: string) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    // SECURITY: Rate limiting
    const rateLimit = await rateLimiters.signage(userId);
    if (!rateLimit.success) {
      return {
        success: false,
        error: "Trop de requêtes. Veuillez patienter 1 minute avant de réessayer.",
      };
    }

    // Vérifier si l'utilisateur peut analyser
    const analysisCheck = await canPerformAnalysis();
    if (!analysisCheck.canAnalyze) {
      return {
        success: false,
        error: analysisCheck.reason || "Vous avez atteint votre limite mensuelle de vérifications.",
      };
    }

    // Validation
    if (!description || description.trim().length < 10) {
      return { success: false, error: "Description trop courte (minimum 10 caractères)" };
    }

    if (description.length > 5000) {
      return { success: false, error: "Description trop longue (maximum 5000 caractères)" };
    }

    // SECURITY: Détecter les tentatives de prompt injection
    const sanitization = sanitizeForAI(description);
    if (sanitization.riskLevel !== "low") {
      logSuspiciousActivity(userId, "analyzeSignage", {
        suspiciousPatterns: sanitization.suspiciousPatterns,
        riskLevel: sanitization.riskLevel,
        textLength: description.length,
      });
    }

    // Analyser avec l'IA
    const result = await analyzeSignageForLoi96(description.trim());

    // Incrémenter le compteur de vérifications
    await incrementChecksUsed();

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse d'enseigne:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'analyse",
    };
  }
}
