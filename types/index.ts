// ===========================================
// Types TypeScript pour ConformLoi96
// ===========================================

import type { User, Document, Analysis, Plan, DocumentType } from "@prisma/client";

// ===========================================
// Re-exports Prisma
// ===========================================
export type { User, Document, Analysis, Plan, DocumentType };

// ===========================================
// Types d'authentification
// ===========================================
export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  plan: Plan;
}

export interface Session {
  user: AuthUser;
  accessToken: string;
}

// ===========================================
// Types d'analyse Loi 96
// ===========================================

/** Types de problèmes */
export type IssueType =
  | "LANGUAGE_PREDOMINANCE"
  | "MISSING_FRENCH_TERM"
  | "ENGLISH_ONLY"
  | "FRENCH_NOT_FIRST"
  | "TAX_TERMINOLOGY"
  | "BUSINESS_TERMINOLOGY"
  | "CONTRACT_CLAUSE"
  | "LEGAL_MENTION"
  | "BUTTON_LABEL"
  | "OTHER";

/** Sévérité du problème */
export type IssueSeverity = "HIGH" | "MEDIUM" | "LOW";

/** Problème de conformité détecté */
export interface ComplianceIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  description: string;
  location?: string;
  originalText?: string;
  legalReference?: string; // Référence à l'article de loi (ex: "Art. 51.1 Loi 96")
}

/** Suggestion de correction */
export interface CorrectionSuggestion {
  id: string;
  issueId: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
}

/** Résultat d'analyse complet */
export interface AnalysisResult {
  isCompliant: boolean;
  complianceScore: number;
  detectedLanguage: "french" | "english" | "bilingual" | "other";
  frenchPercentage: number;
  summary?: string; // Résumé en 1-2 phrases
  issues: ComplianceIssue[];
  suggestions: CorrectionSuggestion[];
  correctedText?: string;
}

export type ComplianceLevel = "COMPLIANT" | "MOSTLY_COMPLIANT" | "NEEDS_WORK" | "NON_COMPLIANT";

export interface LanguageAnalysis {
  detectedLanguages: Record<string, number>;
  primaryLanguage: string;
  frenchPercentage: number;
  englishPercentage: number;
  otherPercentage: number;
  frenchIsPredominant: boolean;
}

// ===========================================
// Types d'upload
// ===========================================

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string; // Base64 ou texte extrait
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
  fileType?: DocumentType;
}

// ===========================================
// Types de facturation
// ===========================================

export interface SubscriptionInfo {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  checksUsed: number;
  checksLimit: number;
  checksRemaining: number;
  trialEndsAt?: Date;
}

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "paused" | "none";

/** Plans Paddle */
export interface PaddlePlan {
  id: string;
  name: string;
  description: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  checksPerMonth: number | "unlimited";
  popular?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  checksPerMonth: number;
  stripePriceId?: string;
  popular?: boolean;
}

// ===========================================
// Types d'API
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ===========================================
// Types de pagination
// ===========================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ===========================================
// Types de dashboard
// ===========================================

export interface DashboardStats {
  totalAnalyses: number;
  avgComplianceScore: number;
  documentsThisMonth: number;
  checksRemaining: number;
  recentAnalyses: AnalysisWithDocument[];
  complianceTrend: ComplianceTrendPoint[];
}

export interface AnalysisWithDocument extends Analysis {
  document: Document;
}

export interface ComplianceTrendPoint {
  date: string;
  score: number;
  count: number;
}
