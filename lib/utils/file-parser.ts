import mammoth from "mammoth";
import pdfParse from "pdf-parse";

/**
 * Extraire le texte d'un fichier selon son type
 */
export async function extractTextFromFile(
  file: File | Buffer,
  mimeType: string
): Promise<string> {
  // Convertir File en Buffer si nécessaire
  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  switch (mimeType) {
    case "application/pdf":
      return extractFromPdf(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return extractFromWord(buffer);

    case "text/plain":
      return buffer.toString("utf-8");

    default:
      throw new Error(`Type de fichier non supporté: ${mimeType}`);
  }
}

/**
 * Extraire le texte d'un PDF
 */
async function extractFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error("Erreur extraction PDF:", error);
    throw new Error("Impossible d'extraire le texte du PDF");
  }
}

/**
 * Extraire le texte d'un document Word
 */
async function extractFromWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error("Erreur extraction Word:", error);
    throw new Error("Impossible d'extraire le texte du document Word");
  }
}

/**
 * Déterminer le type MIME à partir de l'extension
 */
export function getMimeTypeFromExtension(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

/**
 * Valider qu'un fichier est supporté
 */
export function isFileSupported(mimeType: string): boolean {
  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];
  return supportedTypes.includes(mimeType);
}
