import { getAnthropicClient } from "./client";
import {
  ComplianceIssue,
  CorrectionSuggestion,
  AnalysisResult,
  IssueType,
  IssueSeverity,
} from "@/types";

// Prompt système pour l'analyse de conformité Loi 96
const SYSTEM_PROMPT = `Tu es un expert en conformité linguistique pour la Loi 96 du Québec (Charte de la langue française). Ta mission est d'analyser des documents commerciaux et d'identifier les non-conformités.

RÈGLES DE LA LOI 96 À VÉRIFIER:

1. PRÉDOMINANCE DU FRANÇAIS:
   - Le français doit être affiché de manière au moins aussi visible que toute autre langue
   - Dans les documents bilingues, le français doit apparaître EN PREMIER (avant l'anglais)
   - La taille de police du français doit être au moins égale à celle des autres langues

2. TERMINOLOGIE OBLIGATOIRE EN FRANÇAIS:
   - "Invoice" → "Facture"
   - "Quote" / "Estimate" → "Soumission" ou "Devis"
   - "Receipt" → "Reçu"
   - "Contract" / "Agreement" → "Contrat" ou "Entente"
   - "Terms and Conditions" → "Conditions générales" ou "Modalités"
   - "Privacy Policy" → "Politique de confidentialité"
   - "Warranty" → "Garantie"

3. TERMES FISCAUX:
   - "GST" (Goods and Services Tax) → "TPS" (Taxe sur les produits et services)
   - "QST" (Quebec Sales Tax) → "TVQ" (Taxe de vente du Québec)
   - "HST" → "TVH" (Taxe de vente harmonisée)
   - "PST" → Taxe de vente provinciale
   - "Tax" → "Taxe"
   - "Subtotal" → "Sous-total"
   - "Total" → "Total"
   - "Amount Due" → "Montant dû"
   - "Payment" → "Paiement"
   - "Due Date" → "Date d'échéance"

4. TERMES COMMERCIAUX:
   - "Company" → "Entreprise" ou "Société"
   - "Address" → "Adresse"
   - "Phone" → "Téléphone"
   - "Email" → "Courriel"
   - "Website" → "Site web"
   - "Customer" / "Client" → "Client"
   - "Description" → "Description"
   - "Quantity" → "Quantité"
   - "Unit Price" → "Prix unitaire"
   - "Discount" → "Rabais" ou "Remise"
   - "Shipping" → "Livraison" ou "Expédition"

5. FORMULAIRES ET COMMUNICATIONS:
   - Tous les formulaires doivent être disponibles en français
   - Les communications avec les clients québécois doivent être en français

INSTRUCTIONS:

Analyse le document fourni et retourne un JSON avec la structure suivante:
{
  "isCompliant": boolean,
  "complianceScore": number (0-100),
  "detectedLanguage": "french" | "english" | "bilingual" | "other",
  "frenchPercentage": number (0-100),
  "issues": [
    {
      "type": "LANGUAGE_PREDOMINANCE" | "MISSING_FRENCH_TERM" | "ENGLISH_ONLY" | "FRENCH_NOT_FIRST" | "TAX_TERMINOLOGY" | "BUSINESS_TERMINOLOGY" | "CONTRACT_CLAUSE" | "OTHER",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "description": "Description du problème en français",
      "location": "Extrait ou localisation dans le document",
      "originalText": "Le texte problématique original"
    }
  ],
  "suggestions": [
    {
      "issueIndex": number (référence à l'index dans issues),
      "originalText": "Texte original",
      "suggestedText": "Texte corrigé en français",
      "explanation": "Explication de la correction"
    }
  ],
  "correctedText": "Le document complet corrigé avec le français en premier si bilingue"
}

CRITÈRES DE SCORING:
- 100: Document entièrement conforme
- 80-99: Problèmes mineurs (terminologie)
- 60-79: Problèmes moyens (plusieurs termes anglais)
- 40-59: Problèmes majeurs (document principalement anglais)
- 0-39: Non conforme (document uniquement anglais ou français absent)

Sois précis et constructif dans tes suggestions. Retourne UNIQUEMENT le JSON, sans texte additionnel.`;

/**
 * Analyser un document pour la conformité Loi 96
 */
export async function analyzeTextForLoi96(
  text: string,
  documentName: string
): Promise<AnalysisResult> {
  const client = getAnthropicClient();

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyse ce document commercial pour la conformité à la Loi 96:

Nom du document: ${documentName}

Contenu:
---
${text}
---

Retourne l'analyse en JSON.`,
        },
      ],
    });

    // Extraire le texte de la réponse
    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parser le JSON
    let analysisData: {
      isCompliant: boolean;
      complianceScore: number;
      detectedLanguage: string;
      frenchPercentage: number;
      issues: Array<{
        type: string;
        severity: string;
        description: string;
        location?: string;
        originalText?: string;
      }>;
      suggestions: Array<{
        issueIndex: number;
        originalText: string;
        suggestedText: string;
        explanation: string;
      }>;
      correctedText?: string;
    };

    try {
      // Essayer de parser directement
      analysisData = JSON.parse(responseText);
    } catch {
      // Si échec, essayer d'extraire le JSON du texte
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Impossible de parser la réponse de l'IA");
      }
    }

    // Convertir en types TypeScript stricts
    const issues: ComplianceIssue[] = analysisData.issues.map(
      (issue, index) => ({
        id: `issue-${index}`,
        type: issue.type as IssueType,
        severity: issue.severity as IssueSeverity,
        description: issue.description,
        location: issue.location,
        originalText: issue.originalText,
      })
    );

    const suggestions: CorrectionSuggestion[] = analysisData.suggestions.map(
      (suggestion, index) => ({
        id: `suggestion-${index}`,
        issueId: `issue-${suggestion.issueIndex}`,
        originalText: suggestion.originalText,
        suggestedText: suggestion.suggestedText,
        explanation: suggestion.explanation,
      })
    );

    return {
      isCompliant: analysisData.isCompliant,
      complianceScore: Math.max(0, Math.min(100, analysisData.complianceScore)),
      detectedLanguage: analysisData.detectedLanguage as
        | "french"
        | "english"
        | "bilingual"
        | "other",
      frenchPercentage: Math.max(
        0,
        Math.min(100, analysisData.frenchPercentage)
      ),
      issues,
      suggestions,
      correctedText: analysisData.correctedText,
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse IA:", error);
    throw new Error(
      `Erreur lors de l'analyse: ${error instanceof Error ? error.message : "Erreur inconnue"}`
    );
  }
}

/**
 * Analyser un document et retourner une version corrigée
 */
export async function generateCorrectedDocument(
  text: string,
  issues: ComplianceIssue[],
  suggestions: CorrectionSuggestion[]
): Promise<string> {
  const client = getAnthropicClient();

  const issuesDescription = issues
    .map((issue, i) => {
      const suggestion = suggestions.find((s) => s.issueId === issue.id);
      return `${i + 1}. ${issue.description}
   Original: "${issue.originalText || "N/A"}"
   Suggestion: "${suggestion?.suggestedText || "N/A"}"`;
    })
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Génère une version corrigée et conforme à la Loi 96 de ce document.

Document original:
---
${text}
---

Problèmes identifiés et corrections suggérées:
${issuesDescription}

Instructions:
1. Applique toutes les corrections suggérées
2. Si le document est bilingue, place le français EN PREMIER
3. Assure-toi que tous les termes sont en français ou bilingues (français d'abord)
4. Retourne UNIQUEMENT le document corrigé, sans commentaire

Document corrigé:`,
        },
      ],
    });

    const correctedText =
      response.content[0].type === "text" ? response.content[0].text : text;

    return correctedText.trim();
  } catch (error) {
    console.error("Erreur lors de la génération du document corrigé:", error);
    throw new Error("Impossible de générer le document corrigé");
  }
}

export type { AnalysisResult };
