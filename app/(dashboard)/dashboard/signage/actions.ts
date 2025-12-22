"use server";

import { auth } from "@clerk/nextjs/server";
import { analyzeSignageForLoi96 } from "@/lib/ai/analyzer";
import { canPerformAnalysis, incrementChecksUsed } from "@/app/actions/user";

export async function analyzeSignage(description: string) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
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
