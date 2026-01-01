-- ===========================================
-- Loi96.ca - Script de création des tables
-- À exécuter dans Supabase SQL Editor
-- ===========================================

-- Suppression des types enum existants (si ils existent)
DROP TYPE IF EXISTS "Plan" CASCADE;
DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
DROP TYPE IF EXISTS "DocumentType" CASCADE;

-- Création des types enum
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'PRO');
CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'PAUSED', 'CANCELED');
CREATE TYPE "DocumentType" AS ENUM ('PDF', 'WORD', 'TEXT', 'PASTE', 'INVOICE', 'CONTRACT', 'WEBSITE_TEXT', 'MARKETING', 'LEGAL', 'OTHER');

-- ===========================================
-- Table User
-- ===========================================
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "paddleCustomerId" TEXT,
    "paddleSubscriptionId" TEXT,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "checksUsed" INTEGER NOT NULL DEFAULT 0,
    "checksResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Index pour User
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_paddleCustomerId_key" ON "User"("paddleCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_paddleSubscriptionId_key" ON "User"("paddleSubscriptionId");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_paddleCustomerId_idx" ON "User"("paddleCustomerId");

-- ===========================================
-- Table Document
-- ===========================================
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "originalText" TEXT NOT NULL,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- Index pour Document
CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");
CREATE INDEX IF NOT EXISTS "Document_createdAt_idx" ON "Document"("createdAt");

-- Foreign key Document -> User
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ===========================================
-- Table Analysis
-- ===========================================
CREATE TABLE IF NOT EXISTS "Analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "isCompliant" BOOLEAN NOT NULL DEFAULT false,
    "complianceScore" INTEGER NOT NULL DEFAULT 0,
    "detectedLanguage" TEXT,
    "frenchPercentage" DOUBLE PRECISION,
    "issues" TEXT,
    "suggestions" TEXT,
    "correctedText" TEXT,
    "correctedPdfUrl" TEXT,
    "processingTime" INTEGER,
    "aiModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- Index pour Analysis
CREATE INDEX IF NOT EXISTS "Analysis_userId_idx" ON "Analysis"("userId");
CREATE INDEX IF NOT EXISTS "Analysis_documentId_idx" ON "Analysis"("documentId");
CREATE INDEX IF NOT EXISTS "Analysis_createdAt_idx" ON "Analysis"("createdAt");

-- Foreign keys Analysis
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ===========================================
-- Table WebhookEvent
-- ===========================================
CREATE TABLE IF NOT EXISTS "WebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- Index pour WebhookEvent
CREATE UNIQUE INDEX IF NOT EXISTS "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");
CREATE INDEX IF NOT EXISTS "WebhookEvent_eventId_idx" ON "WebhookEvent"("eventId");
CREATE INDEX IF NOT EXISTS "WebhookEvent_eventType_idx" ON "WebhookEvent"("eventType");
CREATE INDEX IF NOT EXISTS "WebhookEvent_processed_idx" ON "WebhookEvent"("processed");

-- ===========================================
-- Table AnalysisAudit
-- ===========================================
CREATE TABLE IF NOT EXISTS "AnalysisAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisAudit_pkey" PRIMARY KEY ("id")
);

-- Index pour AnalysisAudit
CREATE INDEX IF NOT EXISTS "AnalysisAudit_userId_idx" ON "AnalysisAudit"("userId");
CREATE INDEX IF NOT EXISTS "AnalysisAudit_createdAt_idx" ON "AnalysisAudit"("createdAt");
CREATE INDEX IF NOT EXISTS "AnalysisAudit_ipAddress_idx" ON "AnalysisAudit"("ipAddress");

-- ===========================================
-- Fin du script
-- ===========================================
SELECT 'Tables créées avec succès!' AS status;
