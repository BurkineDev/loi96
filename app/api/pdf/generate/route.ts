"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * POST /api/pdf/generate
 * Générer un PDF corrigé pour une analyse
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification avec Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'analyse
    const body = await request.json();
    const { analysisId } = body;

    if (!analysisId) {
      return NextResponse.json(
        { error: "ID d'analyse manquant" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur depuis la base de données
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer l'analyse
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        document: true,
        user: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Analyse non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (analysis.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur est abonné Pro
    const isPaidUser =
      dbUser.plan !== "FREE" &&
      (dbUser.subscriptionStatus === "ACTIVE" ||
        dbUser.subscriptionStatus === "TRIALING");

    if (!isPaidUser) {
      return NextResponse.json(
        { error: "La génération PDF est réservée aux abonnés Pro" },
        { status: 403 }
      );
    }

    // Récupérer le texte corrigé
    const correctedText = analysis.correctedText || analysis.document.originalText;

    // Générer le PDF
    const pdfBytes = await generatePdf({
      title: analysis.document.name,
      content: correctedText,
      score: analysis.complianceScore,
      isCompliant: analysis.isCompliant,
      date: analysis.createdAt,
    });

    // Retourner le PDF
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${analysis.document.name.replace(/\.[^/.]+$/, "")}_conforme.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}

// ===========================================
// Fonction de génération PDF
// ===========================================

interface PdfGenerationParams {
  title: string;
  content: string;
  score: number;
  isCompliant: boolean;
  date: Date;
}

async function generatePdf(params: PdfGenerationParams): Promise<Uint8Array> {
  const { title, content, score, isCompliant, date } = params;

  // Créer un nouveau document PDF
  const pdfDoc = await PDFDocument.create();

  // Charger les polices
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Configuration
  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;
  const fontSize = 11;
  const lineHeight = 16;
  const headerHeight = 100;

  // Couleurs
  const primaryColor = rgb(0, 0.24, 0.65); // Bleu Québec
  const greenColor = rgb(0.13, 0.55, 0.13);
  const redColor = rgb(0.86, 0.15, 0.15);
  const grayColor = rgb(0.4, 0.4, 0.4);

  // Diviser le contenu en lignes
  const words = content.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = helvetica.widthOfTextAtSize(testLine, fontSize);

    if (textWidth <= contentWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Calculer le nombre de pages nécessaires
  const linesPerPage = Math.floor((pageHeight - margin - headerHeight - margin) / lineHeight);
  const totalPages = Math.ceil(lines.length / linesPerPage);

  // Créer les pages
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // En-tête (première page seulement)
    if (pageNum === 0) {
      // Titre
      page.drawText("Loi96.ca", {
        x: margin,
        y,
        size: 24,
        font: helveticaBold,
        color: primaryColor,
      });
      y -= 30;

      // Sous-titre
      page.drawText("Document corrigé conforme à la Loi 96", {
        x: margin,
        y,
        size: 12,
        font: helvetica,
        color: grayColor,
      });
      y -= 25;

      // Ligne de séparation
      page.drawLine({
        start: { x: margin, y },
        end: { x: pageWidth - margin, y },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });
      y -= 20;

      // Informations du document
      page.drawText(`Document: ${title}`, {
        x: margin,
        y,
        size: 10,
        font: helveticaBold,
        color: grayColor,
      });
      y -= 15;

      page.drawText(`Date d'analyse: ${date.toLocaleDateString("fr-CA")}`, {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: grayColor,
      });
      y -= 15;

      // Score et statut
      const statusText = isCompliant ? "CONFORME" : "NON CONFORME";
      const statusColor = isCompliant ? greenColor : redColor;

      page.drawText(`Score: ${score}%`, {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: grayColor,
      });

      page.drawText(statusText, {
        x: pageWidth - margin - helveticaBold.widthOfTextAtSize(statusText, 12),
        y,
        size: 12,
        font: helveticaBold,
        color: statusColor,
      });
      y -= 30;

      // Titre du contenu
      page.drawText("Contenu corrigé:", {
        x: margin,
        y,
        size: 12,
        font: helveticaBold,
        color: primaryColor,
      });
      y -= 20;
    } else {
      y -= headerHeight - 50; // Moins d'espace en haut pour les pages suivantes
    }

    // Contenu
    const startLine = pageNum * linesPerPage;
    const endLine = Math.min(startLine + linesPerPage, lines.length);

    for (let i = startLine; i < endLine; i++) {
      const line = lines[i];
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
      }
      y -= lineHeight;
    }

    // Pied de page
    const footerY = 30;
    page.drawText(`Page ${pageNum + 1} sur ${totalPages}`, {
      x: pageWidth / 2 - 30,
      y: footerY,
      size: 9,
      font: helvetica,
      color: grayColor,
    });

    page.drawText("Généré par Loi96.ca", {
      x: margin,
      y: footerY,
      size: 9,
      font: helvetica,
      color: grayColor,
    });
  }

  // Sérialiser le document
  return pdfDoc.save();
}
