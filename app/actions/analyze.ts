"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { analyzeTextForLoi96 } from "@/lib/ai/analyzer";
import { extractTextFromFile, getMimeTypeFromExtension } from "@/lib/utils/file-parser";
import { canPerformAnalysis, incrementChecksUsed } from "./user";
import { rateLimiters } from "@/lib/security/rate-limit";
import { validateUploadedFile } from "@/lib/security/file-validator";
import { sanitizeForAI, logSuspiciousActivity } from "@/lib/security/prompt-sanitizer";

// Security constants
const MAX_TEXT_LENGTH = 500000; // 500K characters max
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_NAME_LENGTH = 200;

/**
 * Analyser un document pour la conformité Loi 96
 */
export async function analyzeDocument(formData: FormData) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    // SECURITY: Rate limiting
    const rateLimit = await rateLimiters.analyze(userId);
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

    // Récupérer les données du formulaire
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    // Validation
    if (!name || name.trim().length === 0) {
      return { success: false, error: "Le nom du document est requis" };
    }

    // SECURITY: Validate document name length
    if (name.trim().length > MAX_DOCUMENT_NAME_LENGTH) {
      return {
        success: false,
        error: `Le nom du document ne peut pas dépasser ${MAX_DOCUMENT_NAME_LENGTH} caractères`
      };
    }

    // SECURITY: Validate file size
    if (file && file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Le fichier est trop volumineux (maximum 10 Mo)"
      };
    }

    // SECURITY: Validate pasted text length
    if (text && text.length > MAX_TEXT_LENGTH) {
      return {
        success: false,
        error: `Le texte est trop long (maximum ${MAX_TEXT_LENGTH.toLocaleString()} caractères)`
      };
    }

    let extractedText: string;
    let documentType: "PDF" | "WORD" | "TEXT" | "PASTE";
    let fileUrl: string | null = null;

    // Extraire le texte selon le type
    if (type === "FILE" && file) {
      const mimeType = file.type || getMimeTypeFromExtension(file.name);

      // SECURITY: Valider les magic bytes du fichier
      const fileValidation = await validateUploadedFile(file, mimeType);
      if (!fileValidation.valid) {
        return {
          success: false,
          error: fileValidation.error || "Type de fichier invalide",
        };
      }

      extractedText = await extractTextFromFile(file, mimeType);

      // Déterminer le type de document
      if (mimeType === "application/pdf") {
        documentType = "PDF";
      } else if (
        mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mimeType === "application/msword"
      ) {
        documentType = "WORD";
      } else {
        documentType = "TEXT";
      }
    } else if (text && text.trim().length >= 10) {
      extractedText = text.trim();
      documentType = "PASTE";
    } else {
      return {
        success: false,
        error: "Veuillez fournir un fichier ou du texte (minimum 10 caractères)",
      };
    }

    // Vérifier que le texte n'est pas vide
    if (!extractedText || extractedText.trim().length < 10) {
      return {
        success: false,
        error: "Le document ne contient pas assez de texte à analyser",
      };
    }

    // SECURITY: Limit extracted text length (from file parsing)
    if (extractedText.length > MAX_TEXT_LENGTH) {
      extractedText = extractedText.substring(0, MAX_TEXT_LENGTH);
      console.warn(`Text truncated to ${MAX_TEXT_LENGTH} characters for user ${userId}`);
    }

    // SECURITY: Détecter et logger les tentatives de prompt injection
    const sanitization = sanitizeForAI(extractedText);
    if (sanitization.riskLevel !== "low") {
      logSuspiciousActivity(userId, "analyzeDocument", {
        suspiciousPatterns: sanitization.suspiciousPatterns,
        riskLevel: sanitization.riskLevel,
        textLength: extractedText.length,
      });
    }

    const startTime = Date.now();

    // Créer le document dans la base de données
    const document = await prisma.document.create({
      data: {
        userId,
        name: name.trim(),
        type: documentType,
        originalText: extractedText,
        fileUrl,
      },
    });

    // Analyser avec l'IA
    const analysisResult = await analyzeTextForLoi96(extractedText, name);

    const processingTime = Date.now() - startTime;

    // Créer l'analyse dans la base de données
    const analysis = await prisma.analysis.create({
      data: {
        userId,
        documentId: document.id,
        isCompliant: analysisResult.isCompliant,
        complianceScore: analysisResult.complianceScore,
        detectedLanguage: analysisResult.detectedLanguage,
        frenchPercentage: analysisResult.frenchPercentage,
        issues: JSON.stringify(analysisResult.issues),
        suggestions: JSON.stringify(analysisResult.suggestions),
        correctedText: analysisResult.correctedText || null,
        processingTime,
        aiModel: "claude-sonnet-4-20250514",
        completedAt: new Date(),
      },
    });

    // Incrémenter le compteur de vérifications
    await incrementChecksUsed();

    // Revalider les pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");

    return {
      success: true,
      analysisId: analysis.id,
      documentId: document.id,
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'analyse du document",
    };
  }
}

/**
 * Récupérer une analyse par son ID
 */
export async function getAnalysis(analysisId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        document: true,
      },
    });

    if (!analysis) {
      return { success: false, error: "Analyse non trouvée" };
    }

    if (analysis.userId !== userId) {
      return { success: false, error: "Accès non autorisé" };
    }

    return {
      success: true,
      analysis: {
        ...analysis,
        issues: JSON.parse(analysis.issues as string),
        suggestions: JSON.parse(analysis.suggestions as string),
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'analyse:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération de l'analyse",
    };
  }
}

/**
 * Récupérer les analyses récentes de l'utilisateur
 */
export async function getRecentAnalyses(limit = 5) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié", analyses: [] };
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        document: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return {
      success: true,
      analyses: analyses.map((a) => ({
        ...a,
        issues: JSON.parse(a.issues as string),
        suggestions: JSON.parse(a.suggestions as string),
      })),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des analyses:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des analyses",
      analyses: [],
    };
  }
}

/**
 * Récupérer toutes les analyses avec pagination
 */
export async function getAllAnalyses(page = 1, pageSize = 10) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié", analyses: [], total: 0 };
    }

    const skip = (page - 1) * pageSize;

    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          document: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      }),
      prisma.analysis.count({
        where: { userId },
      }),
    ]);

    return {
      success: true,
      analyses: analyses.map((a) => ({
        ...a,
        issues: JSON.parse(a.issues as string),
        suggestions: JSON.parse(a.suggestions as string),
      })),
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des analyses:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des analyses",
      analyses: [],
      total: 0,
    };
  }
}

/**
 * Supprimer une analyse
 */
export async function deleteAnalysis(analysisId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis) {
      return { success: false, error: "Analyse non trouvée" };
    }

    if (analysis.userId !== userId) {
      return { success: false, error: "Accès non autorisé" };
    }

    // Supprimer l'analyse et le document associé
    await prisma.$transaction([
      prisma.analysis.delete({ where: { id: analysisId } }),
      prisma.document.delete({ where: { id: analysis.documentId } }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'analyse:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression de l'analyse",
    };
  }
}
