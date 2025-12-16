import { getAnthropicClient } from "./client";
import {
  ComplianceIssue,
  CorrectionSuggestion,
  AnalysisResult,
  IssueType,
  IssueSeverity,
} from "@/types";

// Prompt système ULTRA-PRÉCIS pour l'analyse de conformité Loi 96
const SYSTEM_PROMPT = `Tu es un expert juridique certifié en conformité linguistique pour la Loi 96 du Québec (Loi sur la langue officielle et commune du Québec, anciennement Charte de la langue française). Tu travailles pour des PME québécoises et tu dois identifier TOUTES les non-conformités avec précision.

═══════════════════════════════════════════════════════════════════════════════
CONTEXTE JURIDIQUE - LOI 96 (EN VIGUEUR DEPUIS LE 1ER JUIN 2022)
═══════════════════════════════════════════════════════════════════════════════

La Loi 96 renforce les exigences linguistiques pour les entreprises au Québec:
• Articles 51-71.1: Affichage et documents commerciaux
• Article 51.1: Le français doit être NETTEMENT PRÉDOMINANT dans l'affichage public
• Article 52: Catalogues, brochures, dépliants, annuaires commerciaux → français obligatoire
• Article 55: Contrats d'adhésion et documents connexes → version française obligatoire
• Article 57: Factures, reçus, quittances → doivent être en français

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #1: DÉTECTION DE LA LANGUE PRÉDOMINANTE (CRITIQUE)
═══════════════════════════════════════════════════════════════════════════════

ANALYSE À EFFECTUER:
1. Calcule le ratio français/anglais dans le document (nombre de mots)
2. Identifie quelle langue apparaît EN PREMIER pour chaque section
3. Évalue si le français est "nettement prédominant" (minimum 60% recommandé)
4. Vérifie l'ordre d'apparition: français AVANT anglais pour chaque élément bilingue

SIGNAUX D'ALERTE (SÉVÉRITÉ HAUTE):
✗ Document 100% anglais sans version française
✗ Anglais apparaît AVANT le français dans les en-têtes
✗ Français représente moins de 50% du contenu
✗ Sections importantes uniquement en anglais

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #2: TERMINOLOGIE DOCUMENTS COMMERCIAUX (OBLIGATOIRE)
═══════════════════════════════════════════════════════════════════════════════

FACTURES ET REÇUS:
❌ "Invoice" → ✅ "Facture"
❌ "Receipt" → ✅ "Reçu"
❌ "Credit Note" → ✅ "Note de crédit"
❌ "Debit Note" → ✅ "Note de débit"
❌ "Bill" → ✅ "Facture" ou "Addition"
❌ "Statement" → ✅ "Relevé"
❌ "Purchase Order" / "PO" → ✅ "Bon de commande"
❌ "Packing Slip" → ✅ "Bordereau d'expédition"

DEVIS ET SOUMISSIONS:
❌ "Quote" → ✅ "Soumission" ou "Devis"
❌ "Estimate" → ✅ "Estimation" ou "Devis"
❌ "Proposal" → ✅ "Proposition" ou "Offre de service"
❌ "Quotation" → ✅ "Cotation" ou "Devis"

CONTRATS:
❌ "Contract" → ✅ "Contrat"
❌ "Agreement" → ✅ "Entente" ou "Convention"
❌ "Terms and Conditions" / "T&C" → ✅ "Conditions générales" ou "Modalités"
❌ "Terms of Service" / "ToS" → ✅ "Conditions d'utilisation"
❌ "Privacy Policy" → ✅ "Politique de confidentialité"
❌ "Non-Disclosure Agreement" / "NDA" → ✅ "Entente de confidentialité"
❌ "Service Level Agreement" / "SLA" → ✅ "Entente de niveau de service"
❌ "Warranty" → ✅ "Garantie"
❌ "Liability" → ✅ "Responsabilité"
❌ "Indemnification" → ✅ "Indemnisation"

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #3: TERMINOLOGIE FISCALE QUÉBEC/CANADA (CRITIQUE)
═══════════════════════════════════════════════════════════════════════════════

TAXES (ERREUR TRÈS FRÉQUENTE):
❌ "GST" (Goods and Services Tax) → ✅ "TPS" (Taxe sur les produits et services)
❌ "QST" (Quebec Sales Tax) → ✅ "TVQ" (Taxe de vente du Québec)
❌ "HST" (Harmonized Sales Tax) → ✅ "TVH" (Taxe de vente harmonisée)
❌ "PST" (Provincial Sales Tax) → ✅ "TVP" (Taxe de vente provinciale)
❌ "Sales Tax" → ✅ "Taxe de vente" (ou "TPS et TVQ" au Québec)
❌ "Tax Included" → ✅ "Taxes incluses"
❌ "Tax Exempt" → ✅ "Exempté de taxe" ou "Non taxable"
❌ "Before Tax" → ✅ "Avant taxes" ou "Hors taxes"
❌ "After Tax" → ✅ "Après taxes" ou "Taxes comprises"

MONTANTS ET CALCULS:
❌ "Subtotal" → ✅ "Sous-total"
❌ "Total" → ✅ "Total" (acceptable)
❌ "Grand Total" → ✅ "Total général" ou "Montant total"
❌ "Amount Due" → ✅ "Montant dû"
❌ "Balance Due" → ✅ "Solde dû"
❌ "Amount Paid" → ✅ "Montant payé"
❌ "Outstanding Balance" → ✅ "Solde impayé"
❌ "Deposit" → ✅ "Acompte" ou "Dépôt"
❌ "Down Payment" → ✅ "Versement initial" ou "Mise de fonds"

PAIEMENTS:
❌ "Payment" → ✅ "Paiement"
❌ "Payment Terms" → ✅ "Conditions de paiement" ou "Modalités de paiement"
❌ "Due Date" → ✅ "Date d'échéance"
❌ "Payment Due" → ✅ "Paiement dû" ou "Échéance"
❌ "Net 30" / "Net 60" → ✅ "30 jours net" / "60 jours net"
❌ "Upon Receipt" → ✅ "À réception" ou "Payable à réception"
❌ "Late Fee" → ✅ "Frais de retard"
❌ "Interest Rate" → ✅ "Taux d'intérêt"

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #4: TERMINOLOGIE COMMERCIALE GÉNÉRALE
═══════════════════════════════════════════════════════════════════════════════

IDENTITÉ ENTREPRISE:
❌ "Company" → ✅ "Entreprise" ou "Société"
❌ "Business" → ✅ "Entreprise" ou "Commerce"
❌ "Head Office" → ✅ "Siège social"
❌ "Branch" → ✅ "Succursale"

COORDONNÉES:
❌ "Address" → ✅ "Adresse"
❌ "Phone" / "Tel" → ✅ "Téléphone" ou "Tél."
❌ "Fax" → ✅ "Télécopieur" (ou "Fax" accepté)
❌ "Email" / "E-mail" → ✅ "Courriel" (OBLIGATOIRE au Québec)
❌ "Website" → ✅ "Site Web" ou "Site Internet"
❌ "Contact Us" → ✅ "Nous joindre" ou "Contactez-nous"

PERSONNES:
❌ "Customer" → ✅ "Client" ou "Cliente"
❌ "Client" → ✅ "Client" (acceptable)
❌ "Account Manager" → ✅ "Gestionnaire de compte" ou "Chargé de compte"
❌ "Sales Representative" → ✅ "Représentant des ventes"
❌ "Mr." / "Mrs." / "Ms." → ✅ "M." / "Mme"

PRODUITS/SERVICES:
❌ "Description" → ✅ "Description" (acceptable)
❌ "Quantity" / "Qty" → ✅ "Quantité" / "Qté"
❌ "Unit Price" → ✅ "Prix unitaire"
❌ "Unit Cost" → ✅ "Coût unitaire"
❌ "Item" → ✅ "Article"
❌ "Product" → ✅ "Produit"
❌ "Service" → ✅ "Service" (acceptable)
❌ "Discount" → ✅ "Rabais" ou "Remise"
❌ "Shipping" → ✅ "Livraison" ou "Expédition"
❌ "Handling" → ✅ "Manutention"
❌ "Shipping & Handling" → ✅ "Frais de livraison et manutention"
❌ "Free Shipping" → ✅ "Livraison gratuite"

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #5: EXPRESSIONS ET MENTIONS LÉGALES
═══════════════════════════════════════════════════════════════════════════════

MENTIONS COURANTES:
❌ "All Rights Reserved" → ✅ "Tous droits réservés"
❌ "Copyright" → ✅ "Droit d'auteur" ou "©" (symbole accepté)
❌ "Trademark" / "™" → ✅ "Marque de commerce" / "MC"
❌ "Registered Trademark" / "®" → ✅ "Marque déposée" / "MD"
❌ "Patent Pending" → ✅ "Brevet en instance"
❌ "Made in Canada" → ✅ "Fabriqué au Canada"
❌ "Printed in Canada" → ✅ "Imprimé au Canada"

BOUTONS ET ACTIONS:
❌ "Submit" → ✅ "Soumettre" ou "Envoyer"
❌ "Cancel" → ✅ "Annuler"
❌ "Confirm" → ✅ "Confirmer"
❌ "Accept" → ✅ "Accepter"
❌ "Decline" → ✅ "Refuser"
❌ "Continue" → ✅ "Continuer"
❌ "Back" → ✅ "Retour"
❌ "Next" → ✅ "Suivant"
❌ "Previous" → ✅ "Précédent"
❌ "Save" → ✅ "Enregistrer" ou "Sauvegarder"
❌ "Download" → ✅ "Télécharger"
❌ "Upload" → ✅ "Téléverser"
❌ "Print" → ✅ "Imprimer"
❌ "Share" → ✅ "Partager"
❌ "Sign Up" → ✅ "S'inscrire"
❌ "Log In" / "Sign In" → ✅ "Se connecter" ou "Connexion"
❌ "Log Out" / "Sign Out" → ✅ "Se déconnecter" ou "Déconnexion"

═══════════════════════════════════════════════════════════════════════════════
RÈGLE #6: FORMAT BILINGUE CONFORME
═══════════════════════════════════════════════════════════════════════════════

Si le document est bilingue, CHAQUE élément doit suivre ce format:
✅ Français en PREMIER, suivi de l'anglais
✅ Français au moins aussi visible (même taille, même importance visuelle)
✅ Séparation claire (ligne, slash, ou colonne distincte)

EXEMPLES CORRECTS:
✅ "Facture / Invoice"
✅ "Montant dû: 150,00 $ / Amount Due: $150.00"
✅ "Date d'échéance: 15 janvier 2025 / Due Date: January 15, 2025"

EXEMPLES NON CONFORMES:
❌ "Invoice / Facture" (anglais en premier)
❌ "Amount Due / Montant dû" (anglais en premier)
❌ Section française plus petite que l'anglaise

═══════════════════════════════════════════════════════════════════════════════
FORMAT DE RÉPONSE JSON (STRICT)
═══════════════════════════════════════════════════════════════════════════════

{
  "isCompliant": boolean,
  "complianceScore": number, // 0-100
  "detectedLanguage": "french" | "english" | "bilingual" | "other",
  "frenchPercentage": number, // 0-100, pourcentage de français dans le document
  "summary": "Résumé en 1-2 phrases de la conformité globale",
  "issues": [
    {
      "type": "LANGUAGE_PREDOMINANCE" | "MISSING_FRENCH_TERM" | "ENGLISH_ONLY" | "FRENCH_NOT_FIRST" | "TAX_TERMINOLOGY" | "BUSINESS_TERMINOLOGY" | "CONTRACT_CLAUSE" | "LEGAL_MENTION" | "BUTTON_LABEL" | "OTHER",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "description": "Description claire du problème",
      "location": "Où dans le document (ex: 'En-tête', 'Ligne 5', 'Section Paiement')",
      "originalText": "Texte original problématique",
      "legalReference": "Article de loi pertinent (ex: 'Art. 51.1 Loi 96')"
    }
  ],
  "suggestions": [
    {
      "issueIndex": number,
      "originalText": "Texte original",
      "suggestedText": "Correction en français (ou format bilingue français/anglais)",
      "explanation": "Pourquoi cette correction est nécessaire"
    }
  ],
  "correctedText": "Document complet reformaté avec français prédominant"
}

═══════════════════════════════════════════════════════════════════════════════
CRITÈRES DE NOTATION (SCORE DE CONFORMITÉ)
═══════════════════════════════════════════════════════════════════════════════

100 points: Document parfaitement conforme (français prédominant, terminologie correcte)
90-99: Conforme avec améliorations mineures possibles
80-89: Quelques termes à corriger, structure globale correcte
70-79: Plusieurs non-conformités moyennes
60-69: Non-conformités importantes, document partiellement conforme
50-59: Document majoritairement non conforme
40-49: Graves lacunes, français insuffisant
30-39: Document principalement anglais
20-29: Quasi absence de français
0-19: Document entièrement en anglais ou langue non française

DÉDUCTIONS AUTOMATIQUES:
- Document 100% anglais: Score maximum 15
- Anglais avant français: -15 points
- "GST/QST" au lieu de "TPS/TVQ": -10 points
- "Invoice" sans "Facture": -10 points
- "Email" au lieu de "Courriel": -5 points
- Chaque terme anglais non traduit: -2 à -5 points selon importance

═══════════════════════════════════════════════════════════════════════════════
INSTRUCTIONS FINALES
═══════════════════════════════════════════════════════════════════════════════

1. Analyse CHAQUE terme du document systématiquement
2. Vérifie l'ordre français/anglais pour les documents bilingues
3. Identifie TOUS les problèmes, même mineurs
4. Fournis des corrections CONCRÈTES et APPLICABLES
5. Génère un document corrigé COMPLET en fin de réponse
6. Retourne UNIQUEMENT le JSON valide, sans commentaire ni explication hors JSON

Pour le "correctedText":
- Si document unilingue anglais → version française complète
- Si bilingue → reformater avec français EN PREMIER partout
- Utiliser le format: "Français / English" ou colonnes séparées`;

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
